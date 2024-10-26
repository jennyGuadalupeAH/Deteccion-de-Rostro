// Lista de mensajes de carga
const loadingMessages = [
   'Cargando...',
   '[==========]',
   '[Mantenido]',
   '[Esperando]',
   '[Iniciando...]',
   '[Accediendo a la base de datos...]',
   '[Conectando...]',
   '[Cifrando datos...]'
];

// Obtener el formulario y añadirle un evento de submit
document.getElementById('upload-form').addEventListener('submit', event => {
   event.preventDefault();

   var formData = new FormData();
   var fileInput = document.getElementById('archivo');

   if (fileInput.files.length === 0) {
      alert('Por favor carga una imagen');
      return;
   }

   formData.append('archivo', fileInput.files[0]);

   // Mostrar el elemento de carga
   var loadingElement = document.getElementById('loading');
   loadingElement.style.display = 'block';

   // Cambiar el texto de carga cada 500 ms
   let index = 0;
   const loadingText = document.getElementById('loading-text');
   const loadingInterval = setInterval(() => {
      loadingText.textContent = loadingMessages[index];
      index = (index + 1) % loadingMessages.length; // Ciclar a través de los mensajes
   }, 500);

   fetch('/get_key_facials', {
      method: 'POST',
      body: formData
  })
  .then(response => {
      // Imprimir la respuesta cruda para depurar
      return response.text().then(text => {
          console.log('Raw response:', text); // Imprime la respuesta cruda
          try {
              return JSON.parse(text); // Intenta analizar el JSON manualmente
          } catch (e) {
              console.error('Error parsing JSON:', e); // Maneja el error de análisis
              throw e; // Lanza el error para que caiga en el .catch
          }
      });
  })
  .then(data => {
      clearInterval(loadingInterval);
      loadingElement.style.display = 'none';
      
      var imagen_original = document.getElementById('imagen_original');
      var contenedor_imagen = document.getElementById('image-ploted');
      imagen_original.src = `data:image/jpeg;base64,${data.image_base64}`;
      contenedor_imagen.classList.toggle('image-ploted');
  })
  .catch(error => {
      clearInterval(loadingInterval);
      loadingElement.style.display = 'none';
      console.error('ERROR', error);
  });
  
});
