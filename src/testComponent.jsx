import { useEffect, useRef } from 'react';

const CameraStream = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.JSMpeg) {
        new window.JSMpeg.Player('ws://localhost:2000/camera', {
          canvas: canvasRef.current,
          autoplay: true,
          audio: false,
        });
        clearInterval(interval); // loaded, stop checking
      }
    }, 100); // keep checking every 100ms until JSMpeg is ready

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Live Camera Stream</h2>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', maxWidth: '640px', border: '2px solid #333', borderRadius: '8px' }}
      />
    </div>
  );
};

export default CameraStream;
