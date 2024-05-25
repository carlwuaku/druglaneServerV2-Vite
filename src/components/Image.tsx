import React from "react";

const LocalImage = ({ image, height, className }: { image: string, height:string, className?:string }) => {
    const imageObject = require(`@/app/assets/${image}`);

    return <img src={imageObject.default} className={className} alt="none" height={height}/>
}

export default LocalImage