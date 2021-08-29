varying vec3 v_Normal;
varying vec3 v_UV1;
varying vec4 v_Position;

uniform vec3 u_Color;
uniform vec3 u_Color2;
uniform float u_Alpha;

void main() {
  vec3 pos = v_Position.xyz / v_Position.w;
  if (pos.y < -4.0) {
    // discard;
  }
  vec3 normal = normalize(v_Normal * 0.5 + 0.5);
  float up = normal.y; //float( > 0.0 || v_Normal.x < 0.0 || v_Normal.z > 0.0 || v_Normal.z < 0.0);
  float alpha = 1.0;// + (v_Position.y * 0.5);
  float shade = normal.y + normal.x * 0.1;
  // vec3 color = u_Color;// - (normal.z * 0.5);
  // if (pos.y <= -2.0) {
  //   color = mix(color, vec3(0.0, 0.0, 0.0), (-2.0 - pos.y) * 0.5);
  //   float a = (-2.0 - pos.y) * 0.5;
  //   color = vec3(a);
  // }

  float a = -1.0;
  float b = -7.0;

  float fade = clamp((a - pos.y) * (a/b), 0.0, 1.0);
  vec3 color = mix(u_Color * shade, u_Color2, pow(fade, 0.9));

  // vec3 color = u_Color * (v_Normal * 0.5 + 0.5);
  // vec4 color = vec4((u_Color * (v_Normal * 0.5 + 0.5)) * alpha, alpha);
  // gl_FragColor = vec4(vec3(v_Position.y + 1.0), 1.0);
  // gl_FragColor = vec4(u_Color * (v_Normal * 0.5 + 0.5), 1.0);
  gl_FragColor = vec4(vec3(color * 1.0 * u_Alpha), u_Alpha);
}