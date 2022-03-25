import React from 'react'

interface ResultsProps {
    nodes: any;
}

function Results(props: ResultsProps) {
    const {nodes} = props;
  return (
    <div>Results
        <p>Nodes: {nodes}</p>
    </div>
  )
}

export default Results