
module.exports = {
    basicVertexShader: `
        varying vec2 vUv;

        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,

    onlyPosVertexShader: `
        uniform vec3 scale;
        uniform vec3 offset;
        void main() {
            vec4 modelViewPosition = modelViewMatrix * vec4(position * scale + offset, 1.0);
            gl_Position = projectionMatrix * modelViewPosition;
        }
    `,

    posAndUVVertexShader: `
        varying vec2 vUv;
        uniform vec3 scale;
        uniform vec3 offset;

        void main() {
            vUv = uv;
            vec4 modelViewPosition = modelViewMatrix * vec4(position * scale + offset, 1.0);
            gl_Position = projectionMatrix * modelViewPosition;
        }`,

    curtainVertexShader: `
        varying vec2 vUv;
        varying vec4 uvScreen;

        void main() {
            vUv = uv;
            vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * modelViewPosition;
            uvScreen = gl_Position;
        }`,

    curtainPixelShader: `
        varying vec2 vUv;
        varying vec4 uvScreen;
        uniform vec4 lightIntensities;
        uniform float curtainOpening;
        uniform sampler2D textureSampler;
        uniform sampler2D alphaSampler;

        vec3 computeAmbience(vec2 screenCoords, float ambience) {
            return vec3((0.8 - (distance(screenCoords, vec2(0.31, 0.45)))) * ambience);
        }

        vec3 computeLight1(vec2 screenCoords) {
            // bedside (dimmer)
            const float lightPower = 0.6;
            //const vec3 color = vec3(0.79, 0.69, 0.36);
            const vec3 color = vec3(0.61, 0.51, 0.34);
            const vec3 screenPosition = vec3(0.5, 0.4, 0.2);
            float intensity = lightIntensities.r;
            float dist = distance(vec3(screenCoords, 0.0), screenPosition) * 3.0;
            float spotPower = 1.0 - min(1.0, dist * dist);
            return color * vec3(spotPower * lightPower * intensity);
        }

        vec3 computeLight2(vec2 screenCoords) {
            // ceiling light
            const float lightPower = 0.25;
            float intensity = lightIntensities.g;
            float spotPower = (screenCoords.y) - 0.25;
            return vec3(spotPower * lightPower * intensity);
        }

        vec3 computeLight3(vec2 screenCoords) {
            // bed spot
            const float lightPower = 0.15;
            const vec3 screenPosition = vec3(0.6, 0.7, 0.7);
            float intensity = lightIntensities.b;
            float spotPower = 1.0 - min(1.0, distance(vec3(screenCoords, 0.0), screenPosition));
            return vec3(spotPower * lightPower * intensity);
        }

        vec3 computeLight4(vec2 screenCoords) {
            // bed spot
            const float lightPower = 0.25;
            const vec3 color = vec3(0.61, 0.51, 0.34);
            const vec3 screenPosition = vec3(0.1, 0.8, 0.0);
            float intensity = lightIntensities.a;
            float dist = distance(vec3(screenCoords, 0.0), screenPosition)*2.0;
            float spotPower = 1.0 - min(1.0, dist);
            return color * vec3(spotPower * lightPower * intensity);
        }

        vec3 computeLight(vec2 screenCoords) {
            vec3 ambience = computeAmbience(screenCoords, 0.2 + (curtainOpening/7.0));
            vec3 fullAmbience = computeAmbience(screenCoords, 1.0);
            return ambience +
                computeLight1(screenCoords) * fullAmbience +
                computeLight2(screenCoords) * fullAmbience +
                computeLight3(screenCoords) * fullAmbience +
                computeLight4(screenCoords) * fullAmbience;
        }

        void main() {
            vec2 screenCoords = (uvScreen.xy / uvScreen.w + vec2(1.0, 1.0)) / 2.0;
            gl_FragColor = texture2D(textureSampler, vUv);
            gl_FragColor.rgb *= computeLight(screenCoords);
            gl_FragColor.a *= texture2D(alphaSampler, screenCoords).r;
        }`,

    pixelShader: `
        varying vec2 vUv;
        uniform float opacity;
        uniform float brightness;
        uniform float grayscale;
        uniform sampler2D textureSampler;

        void main() {
            gl_FragColor = texture2D(textureSampler, vUv) * vec4(brightness, brightness, brightness, opacity);
            float avg = (gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.0;
            gl_FragColor = mix(gl_FragColor, vec4(avg, avg, avg, gl_FragColor.a), grayscale);
        }`,

    flatPixelShader: `
        uniform vec4 color;

        void main() {
            gl_FragColor = color;
        }`,

    compositionShader: `
        uniform sampler2D tDiffuse;

        varying vec2 vUv;

        void main() {
            vec4 blurred = texture2D(tDiffuse, vUv);

            gl_FragColor = blurred;
        }`,

    hBlur: `
        uniform sampler2D tDiffuse;
        uniform float h;

        varying vec2 vUv;

        void main() {
            vec4 sum = vec4( 0.0 );

            vec4 originalSample = texture2D( tDiffuse, vUv );

            sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) ) * 0.0540;
            sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) ) * 0.1216;
            sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) ) * 0.1945;
            sum += originalSample * 0.2270;
            sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) ) * 0.1945;
            sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) ) * 0.1216;
            sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) ) * 0.0540;

            gl_FragColor = sum;
        }`,

    vBlur: `
        uniform sampler2D tDiffuse;
        uniform float v;

        varying vec2 vUv;

        void main() {
            vec4 sum = vec4( 0.0 );

            vec4 originalSample = texture2D( tDiffuse, vUv );

            sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * v ) ) * 0.0540;
            sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * v ) ) * 0.1216;
            sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * v ) ) * 0.1945;
            sum += originalSample * 0.2270;
            sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * v ) ) * 0.1945;
            sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * v ) ) * 0.1216;
            sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * v ) ) * 0.0540;

            gl_FragColor = sum;
        }
    `,
};