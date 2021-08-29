attribute vec3 a_Position;
attribute vec3 a_UV1;
attribute vec3 a_Normal;

varying vec4 v_Position;
varying vec3 v_UV1;
varying vec3 v_Normal;

uniform mat4 u_ViewProjection;
uniform mat4 u_Model;

void main() {
  v_Position = u_Model * vec4(a_Position, 1.0);
  v_Normal = a_Normal;
  v_UV1 = a_UV1;
  gl_Position = u_ViewProjection * u_Model * vec4(a_Position, 1.0);
}