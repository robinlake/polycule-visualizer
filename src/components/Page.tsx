import React, {useState} from 'react'
import NewGraph from './NewGraph'
import NetworkGraphFunctional from './NetworkGraphFunctional'
import Results from './Results'

function Page() {
    const [nodes, setNodes] = useState([
        { id: 0, reflexive: false, name: 'name1' },
        { id: 1, reflexive: true, name: 'name2' },
        { id: 2, reflexive: false, name: 'name3' }
      ]);

    const [links, setLinks] = useState([
        { source: nodes[0], target: nodes[1], left: false, right: true },
        { source: nodes[1], target: nodes[2], left: false, right: true }
      ]);


    return (
        <div>
            {/* <NetworkGraphFunctional
                nodes={nodes}
                links={links}
            /> */}
            <NewGraph
                nodes={nodes}
                links={links}
            />
            <Results nodes={nodes.length} />
        </div>
    )
}

export default Page
