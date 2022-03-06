import React from 'react'
import BarChart from './BarChart'
// import ForceDirectedGraph from './ForceDirectedGraph'
import Graph from './Graph'

function Page() {

    return (
        <div>
            This is the page
            <BarChart/>
            <Graph
                width="100%"
                nodes={[
                    { id: 1, name: "node 1", dependsOn: [] },
                    { id: 7, name: "node 7", dependsOn: [] },
                    { id: 2, name: "node 2", dependsOn: [1] },
                    { id: 3, name: "node 3", dependsOn: [2] },
                    { id: 4, name: "node 4", dependsOn: [2] },
                    { id: 5, name: "node 5", dependsOn: [4, 7] },
                    { id: 6, name: "node 6", dependsOn: [5] }
                ]}
            />
        </div>
    )
}

export default Page
