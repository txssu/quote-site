$( document ).ready(function() {
    a = document.getElementsByClassName('gallery')
    for (var g = 0; g < a.length; g++)
    {
        b = a[g].childNodes
        _id = a[g].id
        var images = []
        for (var i = 0; i < b.length; i++)
        {
            images.push(b[i].innerHTML.split('amp;').join(''))
        }
        $('#' + _id).imagesGrid({
            images: images,
            align: false
        });
    }
    var b = document.getElementsByClassName('nname-cont')
    for (var x = 0; x < b.length; x++)
    {
        for (var y = x + 1; y < b.length; y++)
        {
            if (b[x].innerText.split('\n')[0] == b[y].innerText.split('\n')[0] && b[x].style.marginLeft == b[y].style.marginLeft && b[x].parentElement == b[y].parentElement)
            {
                var content = b[y].innerHTML.replace(/\n<a.*a>/, '')
                if (content.includes('pre-line'))
                {
                    var text = [b[y].innerText.slice(0,b[y].innerText.indexOf('\n')), b[y].innerText.slice(b[y].innerText.indexOf('\n')+1)][1]
                    var _text = [b[x].innerText.slice(0,b[x].innerText.indexOf('\n')), b[x].innerText.slice(b[x].innerText.indexOf('\n')+1)][1] + '\n'
                    var res_text = _text + text
                    b[x].lastElementChild.innerText = res_text
                }
                if (b[y].innerHTML.includes('gallery'))
                {
                    var gallery = b[y].lastElementChild
                    b[x].appendChild(gallery)
                }
                b[y].style.display = "none"
            }
            else
            {
                x = y
            }
        }
    }
    var b = document.getElementsByClassName('nname-cont')
    for (var x = 0; x < b.length; x++)
    {
        if (b[x] == b[x].parentElement.lastElementChild)
        {
            b[x].style.paddingBottom = "20px";
        }
        var chi = b[x].childNodes
        function space(el)
        {
            chi = el.childNodes
            var a = 0
            for (var i = 0; i < chi.length; i++)
            {
                if (chi[i].className != '' && chi[i].className != undefined && chi[i].className.includes('gallery'))
                {
                    a = 1
                }
            }
            if (a == 0)
            {
                el.style.paddingBottom = "20px";
            }
            
        }
        for (var i = 0; i < chi.length; i++)
        {
            if (chi[i].className != '' && chi[i].className != undefined && chi[i].className.includes('gallery'))
            {
                if (b[x - 1].parentElement == b[x].parentElement)
                {
                    space(b[x - 1])
                } 
                b[x].style.paddingBottom = "20px";
                break
            }
        }
    }
    var c = document.getElementsByClassName('el-text')
    function bla(element)
    {
        try
        {
            if (element.innerText.match(/\[(id|club)([0-9]+)\|([^\]]+)\]/))
            {
                var temp = element.innerText.match(/\[(id|club)([0-9]+)\|([^\]]+)\]/)
                var one = temp[1]
                var two = temp[2]
                var three = temp[3]
                link = 'https://vk.com/' + one + two
                element.innerHTML = element.innerHTML.replaceAll(temp[0], '<a href="'+link+'">'+ three +'</a>')
                bla(element)
            }
            if (element.innerText.match(/(https?:\/\/)(([^\s\/]+)+([^\s]+)?)/))
            {
                var temp = element.innerText.match(/(https?:\/\/)(([^\s\/]+)+([^\s]+)?)/)
                text_link = temp[2]
                if (text_link.length > 50)
                {
                    text_link = text_link.substring(0, 47) + '...'
                }
                if (text_link.slice(-1) == '/')
                {
                    text_link = text_link.substring(0, text_link.length -1)
                }
                link = temp[0]
                element.innerHTML = element.innerHTML.replaceAll(link, '<a href="'+link+'">'+ text_link +'</a>')
                bla(element)
            }

        } catch(e) {
            return false
        }
    }
    for (var x = 0; x < c.length; x++)
    {
        bla(c[x])
    }
    // /(https?:\/\/)(([^\s\/]+)+([^\s]+)?)/ - link mathcing
    // /\[(id|club)([0-9]+)\|([^\]]+)\]/ - vkid matching
});
function bebr(event, k)
{
    if (k == 0)
    {
        event.open = !event.open
    }
    else if (k == 1)
    {
        parent = event.parentElement
        parent.open = !parent.open
    }
}