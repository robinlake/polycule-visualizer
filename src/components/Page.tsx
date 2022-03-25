import React from 'react'
import NetworkGraphFunctional from './NetworkGraphFunctional'

function Page() {

    const nodes = [
        { id: 0, reflexive: false },
        { id: 1, reflexive: true },
        { id: 2, reflexive: false }
      ];
      const links = [
        { source: nodes[0], target: nodes[1], left: false, right: true },
        { source: nodes[1], target: nodes[2], left: false, right: true }
      ];

    

    return (
        <div>
            <NetworkGraphFunctional
                nodes={nodes}
                links={links}
            />
        </div>
    )
}

export default Page
