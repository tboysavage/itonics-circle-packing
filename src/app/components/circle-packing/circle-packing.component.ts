import { Component, OnInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { EuropeData, Country } from '../../models/country.model';
import * as d3 from 'd3';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Interface representing hierarchical structure expected by d3.hierarchy
interface HierarchyNodeData {
  name: string;
  children?: HierarchyNodeData[] | Country[];
}

@Component({
  selector: 'app-circle-packing',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './circle-packing.component.html',
  styleUrls: ['./circle-packing.component.css']
})
export class CirclePackingComponent implements OnInit {
  // Toggle state to switch between population and land area
  metricIsPopulation = true;

  private data: EuropeData | null = null;
  private metric: 'population' | 'land_area_km2' = 'population'; // Currently selected metric
  currentContinent: string = '';

  selectedCountry: Country | null = null;

  constructor(private dataService: DataService, private el: ElementRef) {}

  ngOnInit(): void {
    // Load the data and determine the root continent name dynamically
    this.dataService.getEuropeData().subscribe(data => {
      this.data = data;
      this.currentContinent = Object.keys(this.data)[0];
      this.createCirclePacking();
    });
  }

  // Called when the toggle switch is changed
  updateMetricFromToggle() {
    this.metric = this.metricIsPopulation ? 'population' : 'land_area_km2';
    this.createCirclePacking();
  }

  // Closes the side drawer with country info
  closeDrawer() {
    this.selectedCountry = null;
  }

  // Main logic to diplay the circle packing chart
  private createCirclePacking(): void {
    if (!this.data) return;

    const element = this.el.nativeElement;
    d3.select(element).select('svg').selectAll('*').remove(); // Clear everything
    d3.select(element).selectAll('.tooltip').remove();

    const width = 800;
    const height = 800;

    const rootData = (this.data as any)[this.currentContinent];

    // Convert continent data into d3 hierarchy
    const formattedData: HierarchyNodeData = {
      name: this.currentContinent,
      children: Object.entries(rootData).map(([region, countries]) => ({
        name: region,
        children: countries as Country[]
      })) as HierarchyNodeData[]
    };

    // Create the D3 hierarchy and calculate values based on selected metric
    const root = d3.hierarchy<HierarchyNodeData>(formattedData)
      .sum(d => (d as any)[this.metric] || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    // Apply circle packing layout
    const packLayout = d3.pack<HierarchyNodeData>()
      .size([width, height])
      .padding(5);

    const rootNode = packLayout(root);

    // Select SVG and set dimensions
    const svg = d3.select(element).select('svg')
      .attr('width', width)
      .attr('height', height);

    // element used for displaying region names
    const tooltip = d3.select(element)
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(0, 0, 0, 0.7)')
      .style('color', 'white')
      .style('padding', '4px 8px')
      .style('border-radius', '4px')
      .style('pointer-events', 'none')
      .style('font-size', '12px')
      .style('visibility', 'hidden');

    // Create <g> elements for each node and position them
    const nodes = svg.selectAll('g')
      .data(rootNode.descendants())
      .enter()
      .append('g')
      .attr('transform', d => `translate(${d.x}, ${d.y})`);

    // Draw circles for each node
    nodes.append('circle')
      .attr('r', d => d.r)
      .attr('fill', (d: any) => {
        if (d.depth === 0) return '#263238';   // Continent
        if (d.depth === 1) return '#CFD8DC';   // Region
        return '#00ACC1';                      // Country
      })
      .attr('stroke', 'black')
      .style('cursor', d => ((d.data as unknown as Country).country ? 'pointer' : 'default'))
      .on('click', (event, d: any) => {
        // Handle country selection
        if ((d.data as Country).country) {
          this.selectedCountry = d.data as Country;

          // Reset
          d3.selectAll('circle')
            .attr('fill', (d: any) => {
              if (d.depth === 0) return '#263238';
              if (d.depth === 1) return '#CFD8DC';
              return '#00ACC1';
            });

          // Highlight clicked circle
          d3.select(event.currentTarget).attr('fill', '#FF7043');
        }
      })
      .on('mouseover', (event, d: any) => {
        // Determine label based on depth
        let label = '';
        if (d.depth === 2) {
          label = d.parent?.data?.name ?? '';
        } else {
          label = d.data.name;
        }
        tooltip.style('visibility', 'visible').text(label);
      })
      .on('mousemove', (event) => {
        // Move the tooltip with cursor
        tooltip
          .style('top', event.offsetY + 10 + 'px')
          .style('left', event.offsetX + 10 + 'px');
      })
      .on('mouseout', () => {
        tooltip.style('visibility', 'hidden');
      });

    // Add country name labels if circle is large enough
    nodes.append('text')
      .text((d: any) => {
        const country = (d.data as Country).country;
        const r = d.r;
        if (d.children || r < 10) return ''; // skip non-countries and small nodes

        // Hide label if too long for the circle diameter
        return country.length * 5 < r * 2 ? country : '';
      })
      .attr('text-anchor', 'middle')
      .attr('dy', 4)
      .style('font-size', '10px')
      .style('pointer-events', 'none');
  }
}
