import { WithClassName } from '@/types/fcWithClassName';
import React, { FC } from 'react';

// https://upload.wikimedia.org/wikipedia/commons/7/7e/Hammer_and_sickle.svg
{ /* <metadata id="metadata5">
  <rdf:RDF>
    <cc:Work rdf:about="">
      <dc:format>image/svg+xml</dc:format>
      <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
      <dc:title />
    </cc:Work>
  </rdf:RDF>
</metadata> */ }
const Ussr: FC<WithClassName> = ({ className }): JSX.Element => (
  <svg
    className={className}
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:cc="http://creativecommons.org/ns#"
    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    xmlns:svg="http://www.w3.org/2000/svg"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 550 550"
    version="1.1"
    id="svg8"
  >
    <g id="layer1" transform="translate(18.000002,-824.0001)">
      <path fill="currentColor" d="m 157.54301,922.36336 -16.97149,16.9707 -45.256019,45.2539 -56.570993,56.57034 62.227502,62.2246 56.571,-56.5684 299.82842,299.8124 a 32.001491,31.999993 0 0 0 45.25601,0 32.001491,31.999993 0 0 0 0,-45.2539 l -299.82646,-299.8143 16.9715,-16.97074 50.91448,-50.91015 z" id="path1492" />
      <path fill="currentColor" d="m 255.989,844.0001 c 0,0 168.00781,127.99997 168.00783,256 C 423.99684,1164 367.99425,1236 271.98975,1236 c -64.00296,0 -104.24119,-47.7637 -104.24119,-47.7637 l -11.31302,11.3125 a 16.000745,15.999996 0 0 0 -22.62801,0 16.000745,15.999996 0 0 0 -2.47863,3.2227 32.001491,31.999993 0 0 0 -31.464359,8.0918 32.001491,31.999993 0 0 0 -9.330512,21.5449 C 65.101725,1246.1605 22.969246,1272.9834 4.2643862,1308 l 0.029298,0.029 A 32.001491,31.999993 0 0 0 4.2643862,1340 32.001491,31.999993 0 0 0 47.979313,1351.7129 c 35.025561,-18.708 61.854737,-60.8518 75.605087,-86.2813 a 32.001491,31.999993 0 0 0 21.53616,-9.3144 32.001491,31.999993 0 0 0 7.93201,-13.2012 c 24.51647,23.0544 71.44493,57.084 134.93792,57.084 96.00451,0 200.00932,-72 200.00932,-199.9999 0,-160.00002 -232.01081,-256 -232.01081,-256 z" id="path1514" />
    </g>
  </svg>
);
export default Ussr;
