(function() {
    let a=prompt('Enter first number:', '');
    if (!Number(a) && a!=='0') {
        alert('Invalid input data');
        return
    }
    let b=prompt('Enter second number:', '');
    if (!Number(b) && b!=='0') {
        alert('Invalid input data');
        return
    } else if (a>=b) {
        alert('Invalid input data');
        return
    }
    a=parseInt(a);
    b=parseInt(b);
    let i=a+1;
    let result=[];
    for (i; i<b; i++) {
        result.push(i);
    }
    alert('First number: '+a+'\nSecond number: '+b+'\n\nNumbers between: '+result.join(' '));
})()