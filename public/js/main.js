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
            if (b[x].firstElementChild && b[y].firstElementChild)
            {
                var name1 = b[x].firstElementChild.innerText
                var name2 = b[y].firstElementChild.innerText
            }
            if (name1 == name2 && b[x].style.marginLeft == b[y].style.marginLeft && b[x].parentElement == b[y].parentElement)
            {
                var temp = document.createElement('div');
                temp.className = 'el-text';
                temp.style = "white-space: pre-line;"
                if (b[y].getElementsByClassName('el-text')[0] != undefined)
                {
                    for (var i = 0; i < b[y].getElementsByClassName('el-text').length; i++)
                    {
                        temp.innerText = temp.innerText + b[y].getElementsByClassName('el-text')[i].innerText;
                    }
                }
                b[x].appendChild(temp);
                if (b[y].getElementsByClassName('gallery')[0] != undefined)
                {
                    for (var i = 0; i < b[y].getElementsByClassName('gallery').length; i++)
                    {
                        b[x].appendChild(b[y].getElementsByClassName('gallery')[i]);
                    }
                }
                b[y].style.display = "none";
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
                if (x != 0)
                {
                    if (b[x - 1].parentElement == b[x].parentElement)
                    {
                        space(b[x - 1])
                    } 
                    b[x].style.paddingBottom = "20px";
                    break
                }
                else
                {
                    if (b[x + 1].parentElement == b[x].parentElement)
                    {
                        space(b[x + 1])
                    } 
                    b[x].style.paddingBottom = "20px";
                    break
                }
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
        } catch(e) {
            return false
        }
    }
    for (var x = 0; x < c.length; x++)
    {
        bla(c[x])
    }
});

// /(https?:\/\/)(([^\s\/]+)+([^\s]+)?)/ - link mathcing
// /\[(id|club)([0-9]+)\|([^\]]+)\]/ - vkid matching
