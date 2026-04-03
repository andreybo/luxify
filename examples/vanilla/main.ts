import { createFlux } from '../../src';

const flux = createFlux({
  intensity: 0.24,
  color: '#ffb76b',
  autoEnable: true,
  persist: true,
  schedule: {
    from: '19:00',
    to: '07:00'
  }
});

const toggleButton = document.getElementById('toggle-flux');
toggleButton?.addEventListener('click', () => flux.toggle());
