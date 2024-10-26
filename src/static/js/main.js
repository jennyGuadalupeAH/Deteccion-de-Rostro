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
      .then(response => response.json())
      .then(data => {
         // Detener el intervalo de carga
         clearInterval(loadingInterval);
         loadingElement.style.display = 'none';

         if (data.error) {
            alert(data.error);
            return;
         }

         var imagen_original = document.getElementById('imagen_original');
         var contenedor_imagen = document.getElementById('image-ploted');
         imagen_original.src = `data:image/jpeg;base64,${data.image_base64}`;
         contenedor_imagen.classList.toggle('image-ploted');
      })
      .catch(error => {
         // Detener el intervalo de carga en caso de error
         clearInterval(loadingInterval);
         loadingElement.style.display = 'none';
         console.error('ERROR', error);
      });
});
