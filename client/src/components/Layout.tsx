import styled from 'styled-components';

interface FlexProps {
  direction?: 'row' | 'column';
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around';
  align?: 'start' | 'center' | 'end' | 'stretch';
  gap?: string;
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  margin?: string;
  padding?: string;
}

export const Flex = styled.div<FlexProps>`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  justify-content: ${props => props.justify || 'start'};
  align-items: ${props => props.align || 'stretch'};
  flex-wrap: ${props => props.wrap || 'nowrap'};
  gap: ${props => props.gap || '0'};
  margin: ${props => props.margin || '0'};
  padding: ${props => props.padding || '0'};
`;

interface GridProps {
  columns?: string;
  rows?: string;
  gap?: string;
  margin?: string;
  padding?: string;
}

export const Grid = styled.div<GridProps>`
  display: grid;
  grid-template-columns: ${props => props.columns || 'auto'};
  grid-template-rows: ${props => props.rows || 'auto'};
  gap: ${props => props.gap || '0'};
  margin: ${props => props.margin || '0'};
  padding: ${props => props.padding || '0'};
`;

interface BoxProps {
  margin?: string;
  padding?: string;
}

export const Box = styled.div<BoxProps>`
  margin: ${props => props.margin || '0'};
  padding: ${props => props.padding || '0'};
`; 