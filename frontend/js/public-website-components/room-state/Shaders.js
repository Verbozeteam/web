
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
        uniform sampler2D normalSampler;


        vec3 PointLight(vec3 pixelPos, vec3 pixelNorm, float intensity, float range, vec3 screenPosition, vec3 color, float scatter) {
            // The distance from surface to light
            vec3 lightVec = screenPosition - pixelPos;
            float d = length (lightVec);
            // N dot L lighting term
            vec3 lDir = normalize(lightVec);
            float nl = min(max(dot(pixelNorm, lDir), 0.0), 1.0);

            float xVal = min(max((range-d)/range, 0.0), 1.0);
            return vec3(color * xVal * nl * intensity) + intensity * color * scatter;
        }

        vec3 computeAmbience(vec3 screenCoords, float ambience) {
            return vec3((0.8 - (distance(screenCoords, vec3(0.31, 0.45, 0.0)))) * ambience);
        }

        vec3 computeLight1(vec3 screenCoords, vec3 surfaceNormal) {
            float intensity = lightIntensities.r * 10.0;
            float scatter = 0.04;
            float range = 0.5;
            vec3 pos = vec3(0.6, 0.42, -0.02);
            vec3 color = vec3(0.61, 0.51, 0.34);
            return PointLight(screenCoords, surfaceNormal, intensity, range, pos, color, scatter)  * computeAmbience(screenCoords, 1.4);;
        }

        vec3 computeLight2(vec3 screenCoords, vec3 surfaceNormal) {
            float intensity = lightIntensities.g * 1.0;
            float scatter = 0.04;
            float range = 2.0;
            vec3 pos = vec3(-0.5, 0.62, 0.4);
            vec3 color = vec3(0.7, 0.7, 0.7);
            return PointLight(screenCoords, surfaceNormal, intensity, range, pos, color, scatter);
        }

        vec3 computeLight3(vec3 screenCoords, vec3 surfaceNormal) {
            // bed spot
            const float lightPower = 0.3;
            const vec3 screenPosition = vec3(0.6, 0.7, 0.7);
            float intensity = lightIntensities.b;
            float spotPower = 1.0 - min(1.0, distance(screenCoords, screenPosition));
            return vec3(spotPower * lightPower * intensity) * computeAmbience(screenCoords, 1.4);
        }

        vec3 computeLight4(vec3 screenCoords, vec3 surfaceNormal) {
            float intensity = lightIntensities.a * 2.0;
            float scatter = 0.05;
            float range = 0.4;
            vec3 pos = vec3(0.1, 0.42, -0.04);
            vec3 color = vec3(0.61, 0.51, 0.34);
            return PointLight(screenCoords, surfaceNormal, intensity, range, pos, color, scatter);
        }

        vec3 computeLight(vec3 screenCoords, vec3 surfaceNormal) {
            vec3 ambience = computeAmbience(screenCoords, 0.2 + (curtainOpening/7.0));
            return ambience +
                computeLight1(screenCoords, surfaceNormal) +
                computeLight2(screenCoords, surfaceNormal) +
                computeLight3(screenCoords, surfaceNormal) +
                computeLight4(screenCoords, surfaceNormal);
        }

        void main() {
            gl_FragColor = texture2D(textureSampler, vUv);

            float bump = -gl_FragColor.r * 0.05;
            vec3 screenCoords = vec3((uvScreen.xy / uvScreen.w + vec2(1.0, 1.0)) / 2.0, bump);
            vec3 surfaceNormal = texture2D(normalSampler, vUv).rgb * 2.0 - 1.0;

            gl_FragColor.rgb *= computeLight(screenCoords, surfaceNormal);
            gl_FragColor.a *= texture2D(alphaSampler, screenCoords.xy).r;
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