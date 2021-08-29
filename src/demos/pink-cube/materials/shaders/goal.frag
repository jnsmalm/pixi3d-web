varying vec3 v_Normal;
varying vec2 v_UV1;
varying vec3 v_Position;

uniform vec3 u_Color;

void main() {
  vec3 normal = normalize(v_Normal * 0.5 + 0.5);
  float up = normal.y; //float( > 0.0 || v_Normal.x < 0.0 || v_Normal.z > 0.0 || v_Normal.z < 0.0);
  float alpha = 1.0; //0.5 - (v_Position.y * 0.5 + 0.5);
  vec3 color = vec3(0.9, 0.9, 0.9);// - (normal.z * 0.5);
  // vec3 color = u_Color * (v_Normal * 0.5 + 0.5);
  // vec4 color = vec4((u_Color * (v_Normal * 0.5 + 0.5)) * alpha, alpha);
  // gl_FragColor = vec4(vec3(v_Position.y + 1.0), 1.0);
  // gl_FragColor = vec4(u_Color * (v_Normal * 0.5 + 0.5), 1.0);
  gl_FragColor = vec4(vec3(color * alpha), alpha);
}