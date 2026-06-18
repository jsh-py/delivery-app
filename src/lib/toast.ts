export function showToast(message: string, type: 'success' | 'error' = 'success') {
  if (typeof window === 'undefined') return;

  const containerId = 'vibe-toast-container';
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    container.style.position = 'fixed';
    container.style.bottom = '24px';
    container.style.right = '24px';
    container.style.zIndex = '99999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '8px';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'glass-panel';
  toast.style.padding = '14px 20px';
  toast.style.color = type === 'success' ? 'var(--success)' : 'var(--error)';
  toast.style.fontWeight = '600';
  toast.style.fontSize = '14px';
  toast.style.boxShadow = 'var(--shadow-premium)';
  toast.style.display = 'flex';
  toast.style.alignItems = 'center';
  toast.style.gap = '8px';
  toast.style.animation = 'toastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
  toast.style.borderLeft = `4px solid ${type === 'success' ? 'var(--success)' : 'var(--error)'}`;
  toast.style.background = 'var(--bg-card)';
  toast.style.borderRadius = 'var(--radius-md)';
  toast.style.borderTop = '1px solid var(--border-glass)';
  toast.style.borderRight = '1px solid var(--border-glass)';
  toast.style.borderBottom = '1px solid var(--border-glass)';
  toast.style.backdropFilter = 'blur(16px)';
  toast.style.setProperty('-webkit-backdrop-filter', 'blur(16px)');

  const icon = document.createElement('span');
  icon.innerText = type === 'success' ? '✨' : '⚠️';
  toast.appendChild(icon);

  const text = document.createElement('span');
  text.innerText = message;
  toast.appendChild(text);

  container.appendChild(toast);

  if (!document.getElementById('vibe-toast-style')) {
    const style = document.createElement('style');
    style.id = 'vibe-toast-style';
    style.innerHTML = `
      @keyframes toastIn {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      @keyframes toastOut {
        from { transform: translateY(0); opacity: 1; }
        to { transform: translateY(-20px); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => {
      toast.remove();
      if (container && container.childNodes.length === 0) {
        container.remove();
      }
    }, 300);
  }, 3000);
}
