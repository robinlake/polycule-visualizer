import React from 'react'
// import Graph from './Graph'
// import NetworkGraph from './NetworkGraph'
import NetworkGraphFunctional from './NetworkGraphFunctional'
// import ForceDirectedGraph from './ForceDirectedGraph'

function Page() {

    // const nodes_data =  [
    //     {"name": "Travis", "sex": "M"},
    //     {"name": "Rake", "sex": "M"},
    //     {"name": "Diana", "sex": "F"},
    //     {"name": "Rachel", "sex": "F"},
    //     {"name": "Shawn", "sex": "M"},
    //     {"name": "Emerald", "sex": "F"}
    //     ]

    
    // //Create links data 
    // var links_data = [
    //     {"source": "Travis", "target": "Rake"},
    //     {"source": "Diana", "target": "Rake"},
    //     {"source": "Diana", "target": "Rachel"},
    //     {"source": "Rachel", "target": "Rake"},
    //     {"source": "Rachel", "target": "Shawn"},
    //     {"source": "Emerald", "target": "Rachel"}
    // ]

    
    return <NetworkGraphFunctional />

    // return (
    //     <div>
    //         {/* <Graph
    //             width="100%"
    //             nodes={[
    //                 { id: 1, name: "node 1", dependsOn: [] },
    //                 { id: 7, name: "node 7", dependsOn: [] },
    //                 { id: 2, name: "node 2", dependsOn: [1] },
    //                 { id: 3, name: "node 3", dependsOn: [2] },
    //                 { id: 4, name: "node 4", dependsOn: [2] },
    //                 { id: 5, name: "node 5", dependsOn: [4, 7] },
    //                 { id: 6, name: "node 6", dependsOn: [5] }
    //             ]}
    //         /> */}
    //         {/* <ForceDirectedGraph nodes={nodes_data} links={links_data}/> */}
    //         {/* <NetworkGraph /> */}
    //         <NetworkGraphFunctional />
    //     </div>
    // )
}

export default Page
