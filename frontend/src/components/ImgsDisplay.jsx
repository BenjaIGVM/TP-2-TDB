import React from "react";
import { useState } from "react";



export default function ImgsDisplay({ images, containerHeight, containerMaxHeight }) {
  const mediumContainer = `w-[48%] min-w-[48%] overflow-hidden rounded-[10px] box-border`;
  const smallContainer = `relative w-[48%] min-w-[48%] max-w-[48%] overflow-hidden rounded-[10px] box-border`;

  //small:  h-[${midHeight}px] max-h-[${midHeight}px] min-h-[${midHeight}px]
  //medium:  h-[${containerHeight}px]
  //big: min-h-[${containerHeight}px] max-h-[${containerMaxHeight}px]

  const midHeight = containerHeight / 2;
  const midStyle = {
    height: `${containerHeight}px`
  }
  const smallStyle = {
    height: `${midHeight}px`,
    maxHeight: `${midHeight}px`,
    minHeight: `${midHeight}px`
  }
  const bigStyle = {
    maxHeight: `${containerMaxHeight}px`
  }


  return images.slice(Math.max(0, images.length - 4), images.length).map((image, index) => {
    if (images.length !== 3) {
      return <div key={index} className={images.length === 1 ? `w-[98%] min-w-[98%] max-w-[98%] overflow-hidden rounded-[10px] box-border` :
        (images.length === 2 ? mediumContainer : smallContainer)}
        style={{ ...(images.length === 1 ? bigStyle : (images.length === 2 ? midStyle : smallStyle)), marginBottom: '2%', marginLeft: index % 2 !== 0 ? '2%' : 0 }} >

        {index === 3 && images.length > 4 &&
          <div className="absolute rounded-[10px] mx-auto min-w-full bg-background opacity-50 text-[60px] border-[2px] border-primary
          justify-center items-center text-center flex" style={{ minHeight: `${midHeight}px`, maxHeight: `${midHeight}px` }}>
            +{images.length - 4}
          </div>}

        <img key={index} className="rounded-[10px] object-cover min-w-full" style={{ minHeight: images.length === 4 ? `${midHeight}px` : "100%" }} src={image} />

      </div>

    } else {
      if (index === 0) {
        return <div key={index} className={mediumContainer}
          style={{ ...midStyle, marginBottom: '2%', marginRight: '2%' }} >
          <img className="rounded-[10px] object-cover min-w-full min-h-full" key={index} src={image} />
        </div>
      } else {
        if (index === 2) {
          return <div key={index} />
        } else {
          return <div key={index} className={mediumContainer} style={midStyle}>
            <div className={smallContainer} style={{ ...smallStyle, marginBottom: '2%', maxWidth: '100%', width: '100%' }}>
              <img key={index} className="rounded-[10px] object-cover min-w-full" style={{ minHeight: `${midHeight}px` }} src={image} /></div>
            <div className={smallContainer} style={{ ...smallStyle, marginBottom: '2%', maxWidth: '100%', width: '100%' }}>
              <img key={index} className="rounded-[10px] object-cover min-w-full" style={{ minHeight: `${midHeight}px` }} src={images[index + 1]} /></div>
          </div>
        }
      }
    }
  });


};
