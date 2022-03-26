import React from 'react'
import * as d3 from "d3";
import { useD3 } from '../hooks/useD3';

interface GraphProps {
    nodes: any;
    setNodes?: any;
    links: any;
    setLinks?: any;
  }
  
  interface Node extends d3.SimulationNodeDatum {
    id: number;
    reflexive: boolean;
    name: string;
    x: number;
    y: number;
  }
  
  interface Link {
    source: Node;
    target: Node;
    left: boolean;
    right: boolean;
  }
  

function NewGraph(props: GraphProps) {
    const {nodes, links} = props;
    const svgRef = useD3((svg: any) => d3GraphLogic(svg, nodes, links), [])

  return (
    <div>NewGraph
            <svg ref={svgRef}
    style={{
      height: 500,
      width: "100%",
      marginRight: "0px",
      marginLeft: "0px",
    }}
    >
      <g className="network-graph-functional"/>
    </svg>
    </div>
  )
}

export default NewGraph

const d3GraphLogic = (svg: any, nodes: Node[], links: Link[]) => {
    if (!nodes || !links) {
        return;
    }
    // Initialize constants
    const width = 960;
    const height = 500;
    let colors = d3.scaleOrdinal(d3.schemeCategory10);
    

    // mouse event vars
    let selectedNode: Node | null = null;
    let selectedLink: Link | null = null;

    // define arrow markers for graph links
    svg.append('svg:defs').append('svg:marker')
        .attr('id', 'end-arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 6)
        .attr('markerWidth', 3)
        .attr('markerHeight', 3)
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', '#000');

    svg.append('svg:defs').append('svg:marker')
        .attr('id', 'start-arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 4)
        .attr('markerWidth', 3)
        .attr('markerHeight', 3)
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('d', 'M10,-5L0,0L10,5')
        .attr('fill', '#000');

    // Initialize the nodes
    const node = svg.selectAll(".nodes")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "nodes");
        
        node.append("circle")
            .attr('r', 12)
            .style('fill', (d: any) => (d === selectedNode) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id))
            .style('stroke', (d: any) => d3.rgb(colors(d.id)).darker().toString())
            .classed('reflexive', (d: any) => d.reflexive)
    

    // Initialize the links
    const link = svg.selectAll(".links")
        .data(links)
        .enter()
        // .append("g")
        .append("path")
        .attr("class", "links")
        
        // link.append('line')
        .attr("stroke-width", 3)
        .style("stroke", "#aaa")

    // let link = svg.append('svg:g').selectAll('path');
    // let node = svg.append('svg:g').selectAll('g');
    
    
    // Initialize D3 force simulation
    const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink().id((d: any) => d.id).distance(150))
        .force('charge', d3.forceManyBody().strength(-500))
        .force('x', d3.forceX(width / 2))
        .force('y', d3.forceY(height / 2))
        .on('tick', () => tick());

    const tick = () => {
        // draw directed edges with proper padding from node centers
      link.attr('d', (d: any) => {
        const deltaX = d.target.x - d.source.x;
        const deltaY = d.target.y - d.source.y;
        const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const normX = deltaX / dist;
        const normY = deltaY / dist;
        const sourcePadding = d.left ? 17 : 12;
        const targetPadding = d.right ? 17 : 12;
        const sourceX = d.source.x + (sourcePadding * normX);
        const sourceY = d.source.y + (sourcePadding * normY);
        const targetX = d.target.x - (targetPadding * normX);
        const targetY = d.target.y - (targetPadding * normY);
  
        return `M${sourceX},${sourceY}L${targetX},${targetY}`;
      });

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);  
    }

    // function restart() {
    //     // path (link) group
    //     link = link.data(links);
    
    //     // update existing links
    //     link.classed('selected', (d: any) => d === selectedLink)
    //       .style('marker-start', (d: any) => d.left ? 'url(#start-arrow)' : '')
    //       .style('marker-end', (d: any) => d.right ? 'url(#end-arrow)' : '');
    
    //     // remove old links
    //     link.exit().remove();
    
    //     // add new links
    //     link = link.enter().append('svg:path')
    //       .attr('class', 'link')
    //       .classed('selected', (d: any) => d === selectedLink)
    //       .style('marker-start', (d: any) => d.left ? 'url(#start-arrow)' : '')
    //       .style('marker-end', (d: any) => d.right ? 'url(#end-arrow)' : '')
    //       .merge(link);
    
    //     // circle (node) group
    //     // NB: the function arg is crucial here! nodes are known by id, not by index!
    //     node = node.data(nodes, (d: any) => d.id);
    
    //     // update existing nodes (reflexive & selected visual states)
    //     node.selectAll('circle')
    //       .style('fill', (d: any) => (d === selectedNode) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id))
    //       .classed('reflexive', (d: any) => d.reflexive);
    
    //     // add new nodes
    //     const g = node.enter().append('svg:g');
    
    //     g.append('svg:circle')
    //       .attr('class', 'node')
    //       .attr('r', 12)
    //       .style('fill', (d: any) => (d === selectedNode) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id))
    //       .style('stroke', (d: any) => d3.rgb(colors(d.id)).darker().toString())
    //       .classed('reflexive', (d: any) => d.reflexive)
    
    //     // show node IDs
    //     g.append('svg:text')
    //       .attr('x', 0)
    //       .attr('y', 4)
    //       .attr('class', 'id')
    //       // .text((d: any) => d.id);
    //       .text((d: any) => d.name);
    
    //     node = g.merge(node);
    //   }
    //   restart();
}