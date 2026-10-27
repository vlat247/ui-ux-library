# Shader runtime boundary

Reserved for shared graphics runtime helpers and shader code after the rendering
engine is selected. Item-specific source belongs with its item in `src/registry/`.

Future implementation requirements:

- Access canvas and graphics APIs through isolated Client Components.
- Keep graphics packages out of server-rendered metadata and inactive previews.
- Pause unnecessary work when offscreen or when the browser tab is hidden.
- Respect reduced motion and expose pause controls for animated previews.
- Limit canvas resolution and concurrent rendering; agree budgets during design.
- Handle unsupported contexts, initialization failures, and context loss.
- Dispose animation frames, observers, listeners, buffers, textures, and contexts.
- Provide a static fallback and keep essential controls and content in the DOM.

No graphics engine or shader implementation is installed yet.
