import React, { Component, useRef, useEffect } from 'react';
import * as d3 from "d3";

// import './App.css';

function NetworkGraphFunctional() {
  const svgRef = useRef(null);
  // svgRef: React.RefObject<any>;
  let width = 960;
  let height = 500;
  let colors = d3.scaleOrdinal(d3.schemeCategory10);

  let svg: any;

  let nodes = new Array<any>();
  let lastNodeId: number = 0;
  let links = new Array<any>();
  let force: any;
  let drag: any;
  let dragLine: any;
  let path: any;
  let circle: any;

  // mouse event vars
  let selectedNode: any = null;
  let selectedLink: any = null;
  let mousedownLink: any = null;
  let mousedownNode: any = null;
  let mouseupNode: any = null;

  // only respond once per keydown
  let lastKeyDown = -1;

  // constructor(props: any) {
  //   super(props);
  //   this.svgRef = React.createRef();
  // }

  /**
   * variables for graph state, to be initialized on mount 
   */
  let size;


  useEffect(() => {
    if (svgRef) {
      size = 500;
      svg = d3.select(svgRef.current)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .on('contextmenu', (event, d) => { event.preventDefault(); })
  
      // set up initial nodes and links
      //  - nodes are known by 'id', not by index in array.
      //  - reflexive edges are indicated on the node (as a bold black circle).
      //  - links are always source < target; edge directions are set by 'left' and 'right'.
      nodes = [
        { id: 0, reflexive: false },
        { id: 1, reflexive: true },
        { id: 2, reflexive: false }
      ];
  
      lastNodeId = 2;
  
      links = [
        { source: nodes[0], target: nodes[1], left: false, right: true },
        { source: nodes[1], target: nodes[2], left: false, right: true }
      ];
  
      // init D3 force layout
      force = d3.forceSimulation()
        .force('link', d3.forceLink().id((d: any) => d.id).distance(150))
        .force('charge', d3.forceManyBody().strength(-500))
        .force('x', d3.forceX(width / 2))
        .force('y', d3.forceY(height / 2))
        .on('tick', () => tick());
  
      // init D3 drag support
      drag = d3.drag()
        // Mac Firefox doesn't distinguish between left/right click when Ctrl is held... 
        .filter((event, d) => event.button === 0 || event.button === 2)
        .on('start', (event, d: any) => {
          if (!event.active) force.alphaTarget(0.3).restart();
  
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d: any) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d: any) => {
          if (!event.active) force.alphaTarget(0);
  
          d.fx = null;
          d.fy = null;
        });
  
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
  
      // line displayed when dragging new nodes
      dragLine = svg.append('svg:path')
        .attr('class', 'link dragline hidden')
        .attr('d', 'M0,0L0,0');
  
      // handles to link and node element groups
      path = svg.append('svg:g').selectAll('path');
      circle = svg.append('svg:g').selectAll('g');
  
      // app starts here
      svg.on('mousedown', (event: any, d: any) => mousedown(event, d))
        .on('mousemove', (event: any, d: any) => mousemove(event, d))
        .on('mouseup', (event: any, d: any) => mouseup(event, d));
  
      d3.select(window)
        .on('keydown', (event: any, d: any) => keydown(event, d))
        .on('keyup', (event: any, d: any) => keyup(event, d));
  
      restart();
    }
  }, [svgRef])

  // componentDidMount() {
  //   let size = 500;
  //   this.svg = d3.select(this.svgRef.current)
  //     .append("svg")
  //     .attr("width", this.width)
  //     .attr("height", this.height)
  //     .on('contextmenu', (event, d) => { event.preventDefault(); })

  //   // set up initial nodes and links
  //   //  - nodes are known by 'id', not by index in array.
  //   //  - reflexive edges are indicated on the node (as a bold black circle).
  //   //  - links are always source < target; edge directions are set by 'left' and 'right'.
  //   this.nodes = [
  //     { id: 0, reflexive: false },
  //     { id: 1, reflexive: true },
  //     { id: 2, reflexive: false }
  //   ];

  //   this.lastNodeId = 2;

  //   this.links = [
  //     { source: this.nodes[0], target: this.nodes[1], left: false, right: true },
  //     { source: this.nodes[1], target: this.nodes[2], left: false, right: true }
  //   ];

  //   // init D3 force layout
  //   this.force = d3.forceSimulation()
  //     .force('link', d3.forceLink().id((d: any) => d.id).distance(150))
  //     .force('charge', d3.forceManyBody().strength(-500))
  //     .force('x', d3.forceX(this.width / 2))
  //     .force('y', d3.forceY(this.height / 2))
  //     .on('tick', () => this.tick());

  //   // init D3 drag support
  //   this.drag = d3.drag()
  //     // Mac Firefox doesn't distinguish between left/right click when Ctrl is held... 
  //     .filter((event, d) => event.button === 0 || event.button === 2)
  //     .on('start', (event, d: any) => {
  //       if (!event.active) this.force.alphaTarget(0.3).restart();

  //       d.fx = d.x;
  //       d.fy = d.y;
  //     })
  //     .on('drag', (event, d: any) => {
  //       d.fx = event.x;
  //       d.fy = event.y;
  //     })
  //     .on('end', (event, d: any) => {
  //       if (!event.active) this.force.alphaTarget(0);

  //       d.fx = null;
  //       d.fy = null;
  //     });

  //   // define arrow markers for graph links
  //   this.svg.append('svg:defs').append('svg:marker')
  //     .attr('id', 'end-arrow')
  //     .attr('viewBox', '0 -5 10 10')
  //     .attr('refX', 6)
  //     .attr('markerWidth', 3)
  //     .attr('markerHeight', 3)
  //     .attr('orient', 'auto')
  //     .append('svg:path')
  //     .attr('d', 'M0,-5L10,0L0,5')
  //     .attr('fill', '#000');

  //   this.svg.append('svg:defs').append('svg:marker')
  //     .attr('id', 'start-arrow')
  //     .attr('viewBox', '0 -5 10 10')
  //     .attr('refX', 4)
  //     .attr('markerWidth', 3)
  //     .attr('markerHeight', 3)
  //     .attr('orient', 'auto')
  //     .append('svg:path')
  //     .attr('d', 'M10,-5L0,0L10,5')
  //     .attr('fill', '#000');

  //   // line displayed when dragging new nodes
  //   this.dragLine = this.svg.append('svg:path')
  //     .attr('class', 'link dragline hidden')
  //     .attr('d', 'M0,0L0,0');

  //   // handles to link and node element groups
  //   this.path = this.svg.append('svg:g').selectAll('path');
  //   this.circle = this.svg.append('svg:g').selectAll('g');

  //   // app starts here
  //   this.svg.on('mousedown', (event: any, d: any) => this.mousedown(event, d))
  //     .on('mousemove', (event: any, d: any) => this.mousemove(event, d))
  //     .on('mouseup', (event: any, d: any) => this.mouseup(event, d));

  //   d3.select(window)
  //     .on('keydown', (event: any, d: any) => this.keydown(event, d))
  //     .on('keyup', (event: any, d: any) => this.keyup(event, d));

  //   this.restart();
  // }

  function resetMouseVars() {
    mousedownNode = null;
    mouseupNode = null;
    mousedownLink = null;
  }

  // update force layout (called automatically each iteration)
  function tick() {
    // draw directed edges with proper padding from node centers
    path.attr('d', (d: any) => {
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

    circle.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
  }

  // update graph (called when needed)
  function restart() {
    // path (link) group
    path = path.data(links);

    // update existing links
    path.classed('selected', (d: any) => d === selectedLink)
      .style('marker-start', (d: any) => d.left ? 'url(#start-arrow)' : '')
      .style('marker-end', (d: any) => d.right ? 'url(#end-arrow)' : '');

    // remove old links
    path.exit().remove();

    // add new links
    path = path.enter().append('svg:path')
      .attr('class', 'link')
      .classed('selected', (d: any) => d === selectedLink)
      .style('marker-start', (d: any) => d.left ? 'url(#start-arrow)' : '')
      .style('marker-end', (d: any) => d.right ? 'url(#end-arrow)' : '')
      .on('mousedown', (event: any, d: any) => {
        if (event.ctrlKey) return;

        // select link
        mousedownLink = d;
        selectedLink = (mousedownLink === selectedLink) ? null : mousedownLink;
        selectedNode = null;
        restart();
      })
      .merge(path);

    // circle (node) group
    // NB: the function arg is crucial here! nodes are known by id, not by index!
    circle = circle.data(nodes, (d: any) => d.id);

    // update existing nodes (reflexive & selected visual states)
    circle.selectAll('circle')
      .style('fill', (d: any) => (d === selectedNode) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id))
      .classed('reflexive', (d: any) => d.reflexive);

    // remove old nodes
    circle.exit().remove();

    // add new nodes
    const g = circle.enter().append('svg:g');

    g.append('svg:circle')
      .attr('class', 'node')
      .attr('r', 12)
      .style('fill', (d: any) => (d === selectedNode) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id))
      .style('stroke', (d: any) => d3.rgb(colors(d.id)).darker().toString())
      .classed('reflexive', (d: any) => d.reflexive)
      .on('mouseover', (event: any, d: any) => {
        if (!mousedownNode || d === mousedownNode) return;
        // enlarge target node
        d3.select(event.currentTarget).attr('transform', 'scale(1.1)');
      })
      .on('mouseout', (event: any, d: any) => {
        if (!mousedownNode || d === mousedownNode) return;
        // unenlarge target node
        d3.select(event?.currentTarget).attr('transform', '');
      })
      .on('mousedown', (event: any, d: any) => {
        if (event.ctrlKey) return;

        // select node
        mousedownNode = d;
        selectedNode = (mousedownNode === selectedNode) ? null : mousedownNode;
        selectedLink = null;

        // reposition drag line
        dragLine
          .style('marker-end', 'url(#end-arrow)')
          .classed('hidden', false)
          .attr('d', `M${mousedownNode.x},${mousedownNode.y}L${mousedownNode.x},${mousedownNode.y}`);

        restart();
      })
      .on('mouseup', (event: any, d: any) => {
        if (!mousedownNode) return;

        // needed by FF
        dragLine
          .classed('hidden', true)
          .style('marker-end', '');

        // check for drag-to-self
        mouseupNode = d;
        if (mouseupNode === mousedownNode) {
          resetMouseVars();
          return;
        }

        // unenlarge target node
        d3.select(event.currentTarget).attr('transform', '');

        // add link to graph (update if exists)
        // NB: links are strictly source < target; arrows separately specified by booleans
        const isRight = mousedownNode.id < mouseupNode.id;
        const source = isRight ? mousedownNode : mouseupNode;
        const target = isRight ? mouseupNode : mousedownNode;

        let link = links.filter((l: any) => l.source === source && l.target === target)[0];
        if (link) {
          link[isRight ? 'right' : 'left'] = true;
        } else {
          links.push({ source, target, left: !isRight, right: isRight });
        }

        // select new link
        selectedLink = link;
        selectedNode = null;
        restart();
      });

    // show node IDs
    g.append('svg:text')
      .attr('x', 0)
      .attr('y', 4)
      .attr('class', 'id')
      .text((d: any) => d.id);

    circle = g.merge(circle);

    // set the graph in motion
    force
      .nodes(nodes)
      .force('link').links(links);

    force.alphaTarget(0.3).restart();
  }

  function mousedown(event: any, d: any) {
    // because :active only works in WebKit?
    svg.classed('active', event.currentTarget);

    if (event.ctrlKey || mousedownNode || mousedownLink) return;

    // insert new node at point
    const point = d3.pointer(event);
    const node = { id: ++lastNodeId, reflexive: false, x: point[0], y: point[1] };
    nodes.push(node);

    restart();
  }

  function mousemove(event: any, d: any) {
    if (!mousedownNode) return;
    // update drag line
    dragLine.attr('d', `M${mousedownNode.x},${mousedownNode.y}L${d3.pointer(event)[0]},${d3.pointer(event)[1]}`);
  }

  function mouseup(event: any, d: any) {
    if (mousedownNode) {
      // hide drag line
      dragLine
        .classed('hidden', event.currentTarget)
        .style('marker-end', '');
    }

    // because :active only works in WebKit?
    svg.classed('active', false);

    // clear mouse event vars
    resetMouseVars();
  }

  function spliceLinksForNode(node: any) {
    const toSplice = links.filter((l) => l.source === node || l.target === node);
    for (const l of toSplice) {
      links.splice(links.indexOf(l), 1);
    }
  }

  function keydown(event: any, d: any) {
    event.preventDefault();

    if (lastKeyDown !== -1) return;
    lastKeyDown = event.keyCode;

    // ctrl
    if (event.keyCode === 17) {
      circle.call(drag);
      svg.classed('ctrl', event.currentTarget);
      return;
    }

    if (!selectedNode && !selectedLink) return;

    switch (event.keyCode) {
      case 8: // backspace
      case 46: // delete
        if (selectedNode) {
          nodes.splice(nodes.indexOf(selectedNode), 1);
          spliceLinksForNode(selectedNode);
        } else if (selectedLink) {
          links.splice(links.indexOf(selectedLink), 1);
        }
        selectedLink = null;
        selectedNode = null;
        restart();
        break;
      case 66: // B
        if (selectedLink) {
          // set link direction to both left and right
          selectedLink.left = true;
          selectedLink.right = true;
        }
        restart();
        break;
      case 76: // L
        if (selectedLink) {
          // set link direction to left only
          selectedLink.left = true;
          selectedLink.right = false;
        }
        restart();
        break;
      case 82: // R
        if (selectedNode) {
          // toggle node reflexivity
          selectedNode.reflexive = !selectedNode.reflexive;
        } else if (selectedLink) {
          // set link direction to right only
          selectedLink.left = false;
          selectedLink.right = true;
        }
        restart();
        break;
    }
  }

  function keyup(event: any, d: any) {
    lastKeyDown = -1;

    // ctrl
    if (event.keyCode === 17) {
      circle.on('.drag', null);
      svg.classed('ctrl', false);
    }
  }

  return (
    <div className="network-graph-functional">
      <div ref={svgRef}> </div>
    </div>
  )

}

export default NetworkGraphFunctional;