import React from 'react';
import * as d3 from 'd3';

export const useD3 = (renderChartFn: any, dependencies: any) => {
    const ref = React.useRef<SVGSVGElement>(null);

    React.useEffect(() => {
        renderChartFn(d3.select(ref.current));
        return () => {};
      }, [renderChartFn, dependencies]);
    return ref;
}