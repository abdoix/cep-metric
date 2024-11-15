declare module 'rc-slider' {
    import * as React from 'react';

    export interface SliderProps {
        min?: number;
        max?: number;
        value?: number;
        onChange?: (value: number) => void;
        handleStyle?: React.CSSProperties;
        trackStyle?: React.CSSProperties;
    }

    export default class Slider extends React.Component<SliderProps> {}
}