declare module "react-rating-stars-component" {
  import React from "react";

  export interface ReactStarsProps {
    count?: number;
    value?: number;
    isHalf?: boolean;
    edit?: boolean;
    size?: number;
    activeColor?: string;
    // Add other props as needed
  }

  const ReactStars: React.FC<ReactStarsProps>;
  export default ReactStars;
}
