import React, {useState, useEffect, useRef} from 'react'
import * as d3 from 'd3';
import { SimulationNodeDatum } from 'd3-force'

function ForceDirectedGraph() {
    //create somewhere to put the force directed graph
    const d3Container = useRef(null);

    useEffect(() => {
        if (d3Container) {
            var svg = d3.select("svg"),
            width = +svg.attr("width"),
            height = +svg.attr("height");

            interface MyNode extends SimulationNodeDatum {
                name: string;
                sex: string;
            };
        
            var nodes_data: MyNode[] =  [
                {"name": "Travis", "sex": "M"},
                {"name": "Rake", "sex": "M"},
                {"name": "Diana", "sex": "F"},
                {"name": "Rachel", "sex": "F"},
                {"name": "Shawn", "sex": "M"},
                {"name": "Emerald", "sex": "F"}
                ]
            
            const simulation = d3.forceSimulation()
                .nodes(nodes_data);
                
            //add forces
            //we're going to add a charge to each node 
            //also going to add a centering force
            simulation
            .force("charge_force", d3.forceManyBody())
            .force("center_force", d3.forceCenter(width / 2, height / 2));

            //draw circles for the nodes 
            var node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(nodes_data)
            .enter()
            .append("circle")
            .attr("r", 5)
            .attr("fill", "red");  

            //add tick instructions: 
            simulation.on("tick", tickActions );

            //Create links data 
            var links_data = [
                {"source": "Travis", "target": "Rake"},
                {"source": "Diana", "target": "Rake"},
                {"source": "Diana", "target": "Rachel"},
                {"source": "Rachel", "target": "Rake"},
                {"source": "Rachel", "target": "Shawn"},
                {"source": "Emerald", "target": "Rachel"}
            ]



            //Create the link force 
            //We need the id accessor to use named sources and targets 

            var link_force =  d3.forceLink(links_data)
                                    // .id(function(d) { return d.name; })
                                    .id((d: any) => { return d.name; })

            //Add a links force to the simulation
            //Specify links  in d3.forceLink argument  
            simulation.force("links",link_force)
            
            //draw lines for the links 
            var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(links_data)
            .enter().append("line")
            .attr("stroke-width", 2); 

            function tickActions() {
                //update circle positions each tick of the simulation 
                node
                    .attr("cx", (d: any) => { return d.x; })
                    .attr("cy", (d: any) => { return d.y; });
                    
                //update link positions 
                //simply tells one end of the line to follow one node around
                //and the other end of the line to follow the other node around
                link
                    .attr("x1", (d: any) => { return d.source.x; })
                    .attr("y1", (d: any) => { return d.source.y; })
                    .attr("x2", (d: any) => { return d.target.x; })
                    .attr("y2", (d: any) => { return d.target.y; });
              }   

        }
    }, [d3Container])

    
    return (
        <div>
            force directed graph
            <svg
                className="d3-component"
                width={400}
                height={200}
                ref={d3Container}
            />
        </div>
    )
}

export default ForceDirectedGraph
