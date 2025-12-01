export interface Perspective {
  name: string;
  percentage: number;
  emotion: string;
  arguments: string[];
}

export interface GroundingSource {
  title?: string;
  uri?: string;
}

export interface PulseData {
  topic: string;
  summary: string;
  sideA: Perspective;
  sideB: Perspective;
  neutral: {
    percentage: number;
    summary: string;
  };
  sources: GroundingSource[];
}
