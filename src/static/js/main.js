// Obtener el formulario y añadirle un evento de submit
document.getElementById('upload-form').addEventListener('submit', event => {
   event.preventDefault()

   var formData = new FormData()
   var fileInput = document.getElementById('archivo')

   if (fileInput.files.length === 0) {
      alert('Por favor carga una imagen')
      return
   }

   formData.append('archivo', fileInput.files[0])

   fetch('/get_key_facials', {
      method: 'POST',
      body: formData
   })
      .then(response => response.json())
      .then(data => {
         
         if (data.error) {
            alert(data.error)
            return
         }

         var imagen_original = document.getElementById('imagen_original')
         var contenedor_imagen = document.getElementById('image-ploted')
         imagen_original.src = `data:image/jpeg;base64,${data.image_base64}`;
         contenedor_imagen.classList.toggle('image-ploted')

      })
      .catch(error => console.error('ERROR', error))
})