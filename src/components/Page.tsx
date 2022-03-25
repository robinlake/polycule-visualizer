import React, {useState} from 'react'
import NetworkGraphFunctional from './NetworkGraphFunctional'
import Results from './Results'

function Page() {
    const [nodes, setNodes] = useState([
        { id: 0, reflexive: false },
        { id: 1, reflexive: true },
        { id: 2, reflexive: false }
      ]);

    const [links, setLinks] = useState([
        { source: nodes[0], target: nodes[1], left: false, right: true },
        { source: nodes[1], target: nodes[2], left: false, right: true }
      ]);

    return (
        <div>
            <NetworkGraphFunctional
                nodes={nodes}
                setNodes={setNodes}
                links={links}
                setLinks={setLinks}
            />
            <Results nodes={nodes.length} />
        </div>
    )
}

export default Page
