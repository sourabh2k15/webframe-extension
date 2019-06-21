function setScreenshot(images){
    images.forEach(imageData => {
        var img = document.createElement('img');
        img.src = imageData;
        
        document.body.appendChild(img);
    });
}