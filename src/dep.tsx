import * as React from "react";
import {render} from "react-dom";


export const o = (a: string) => render(
    <h1>Hello from Y {a} CHAO and!</h1>,
    document.getElementById("container")
);
