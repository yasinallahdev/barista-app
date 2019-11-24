var complete = document.querySelectorAll(".complete")

Array.from(complete).forEach(function(element) {
    element.addEventListener('click', function(){
        const customerName = this.parentNode.childNodes[1].innerText
        const customerOrder = this.parentNode.childNodes[3].innerText
        const barista = document.querySelector("#baristaName").innerText
        console.log(customerName, customerOrder)
        var utterThis = new SpeechSynthesisUtterance(`${customerName}, your order is ready! Your order of ${customerOrder} was it prepared by ${barista}`);
        utterThis.voice = voices[9];
        utterThis.pitch = 0.7;
        utterThis.rate = 0.8;
        synth.speak(utterThis);
        if(this.checked){
            fetch('complete', {
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                  'customerName': customerName,
                  'customerOrder': customerOrder,
                })
              })
              .then(response => {
                if (response.ok) return response.json()
              })
              .then(data => {
                console.log(data)
                window.location.reload(true)
              })
            } else{
                console.log('not checked')
            }
        })
});