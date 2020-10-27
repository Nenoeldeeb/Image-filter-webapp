var backup = null;
var backup2 = null;

function upfor() {
    can1 = document.getElementById("can1");
    forg = document.getElementById("forg");
    fimg = new SimpleImage(forg);
    backup = new SimpleImage(forg);
    fimg.drawTo(can1);
}

function upback() {
    can2 = document.getElementById("can2");
    back = document.getElementById("back");
    bimg = new SimpleImage(back);
    backup2 = new SimpleImage(back);
    bimg.drawTo(can2);
}

function checkf() {
    if (backup == null || !backup.complete()) {
        alert("Foreground image not loaded yet");
        return false;
    }
}

function checkb() {
    if (backup2 == null || !backup2.complete()) {
        alert("Background image not loaded yet");
        return false;
    }
}

function reset() {
    can3 = document.getElementById("can3");
    var ct = can3.getContext("2d");
    ct.beginPath();
    ct.save();
    ct.setTransform(1, 0, 0, 1, 0, 0);
    ct.clearRect(0, 0, can3.width, can3.height);
    ct.restore();
}

function makegreens(forgim, backgim) {
    greensout = new SimpleImage(forgim.getWidth(), forgim.getHeight());
    for (var px of forgim.values()) {
        var x = px.getX();
        var y = px.getY();
        var bpx = backgim.getPixel(x, y);
        if (px.getGreen() >= 200 && px.getRed() <= 200 && px.getBlue() <= 200) {
            greensout.setPixel(x, y, bpx);
        } else {
            greensout.setPixel(x, y, px);
        }
    }
    return greensout;
}

function dogreens() {
    checkf();
    checkb();
    var greenf = backup;
    var greeb = backup2;
    reset();
    makegreens(greenf, greeb);
    greensout.drawTo(can3);
}

function makegrays(image) {
    grayout = new SimpleImage(image.getWidth(), image.getHeight());
    for (var px of image.values()) {
        var opx = grayout.getPixel(px.getX(), px.getY());
        var avg = (px.getRed() + px.getGreen() + px.getBlue()) / 3;
        opx.setRed(avg);
        opx.setGreen(avg);
        opx.setBlue(avg);
    }
    return grayout;
}

function dograys() {
    checkf();
    var gsimg = backup;
    reset();
    makegrays(gsimg);
    grayout.drawTo(can3);
}

function makered(image) {
    redout = new SimpleImage(image.getWidth(), image.getHeight());
    for (var px of image.values()) {
        var avg = (px.getRed() + px.getGreen() + px.getBlue()) / 3;
        var opx = redout.getPixel(px.getX(), px.getY());
        if (avg >= 128) {
            opx.setRed(255);
            opx.setGreen(2 * avg - 255);
            opx.setBlue(2 * avg - 255);
        } else {
            opx.setRed(2 * avg);
            opx.setGreen(0);
            opx.setBlue(0);
        }
    }
    return redout;
}

function dored() {
    checkf();
    var redimg = backup;
    reset();
    makered(redimg);
    redout.drawTo(can3);
}

function makebw(image) {
    bwout = new SimpleImage(image.getWidth(), image.getHeight());
    for (var px of image.values()) {
        var opx = bwout.getPixel(px.getX(), px.getY());
        var avg = (px.getRed() + px.getGreen() + px.getBlue()) / 3;
        opx.setRed(2 * avg);
        opx.setGreen(2 * avg);
        opx.setBlue(2 * avg);
    }
    return bwout;
}

function dobw() {
    checkf();
    var bwimg = backup;
    reset();
    makebw(bwimg);
    bwout.drawTo(can3);
}

function makeblur(image) {
    blout = new SimpleImage(image.getWidth(), image.getHeight());
    for (var px of image.values()) {
        var rnd = Math.random();
        var x = px.getX();
        var y = px.getY();
        var nx = x + Math.floor((Math.random() * 10) + 1);
        var ny = y + Math.floor((Math.random() * 10) + 1);
        if (nx > image.getWidth() - 1) {
            nx = image.getWidth() - 1;
        }
        if (nx < 0) {
            nx = 0;
        }
        if (ny > image.getHeight() - 1) {
            ny = image.getHeight() - 1;
        }
        if (ny < 0) {
            ny = 0;
        }
        var npx = image.getPixel(nx, ny);
        if (rnd < 0) {
            blout.setPixel(x, y, px);
        } else {
            blout.setPixel(nx, ny, npx);
        }
    }
    return blout;
}

function doblur() {
    checkf();
    var blimg = backup;
    reset();
    makeblur(blimg);
    blout.drawTo(can3);
}

function crop(hide, hidein) {
    cropout = new SimpleImage(hide.getWidth(), hide.getHeight());
    var hiw = hidein.getWidth();
    var hw = hide.getWidth();
    var hih = hidein.getHeight();
    var hh = hide.getHeight();
    if (hw < hiw) {
        if (hh < hih) {
            hidein.setSize(hw, hh);
        }
    }
    if (hw > hiw) {
        if (hh > hih) {
            hidein.setSize(hw, hh);
        }
    }
    for (var px of cropout.values()) {
        var hipx = hidein.getPixel(px.getX(), px.getY());
        px.setRed(hipx.getRed());
        px.setGreen(hipx.getGreen());
        px.setBlue(hipx.getBlue());

    }
    return cropout;
}

function clearbits(colorval) {
    var color = Math.floor(colorval / 16) * 16;
    return color;
}

function prephidein(hidein) {
    prepout = new SimpleImage(hidein.getWidth(), hidein.getHeight());
    for (var px of prepout.values()) {
        var hipx = hidein.getPixel(px.getX(), px.getY());
        px.setRed(clearbits(hipx.getRed()));
        px.setGreen(clearbits(hipx.getGreen()));
        px.setBlue(clearbits(hipx.getBlue()));
    }
    return prepout;
}

function shiftcolor(hide) {
    shiftout = new SimpleImage(hide.getWidth(), hide.getHeight());
    for (var px of shiftout.values()) {
        var hpx = hide.getPixel(px.getX(), px.getY());
        px.setRed(hpx.getRed() / 16);
        px.setGreen(hpx.getGreen() / 16);
        px.setBlue(hpx.getBlue() / 16);
    }
    return shiftout;
}

function makesteg(hide, hidein) {
    stegout = new SimpleImage(hide.getWidth(), hide.getHeight());
    for (var px of stegout.values()) {
        var hpx = hide.getPixel(px.getX(), px.getY());
        var hipx = hidein.getPixel(px.getX(), px.getY());
        px.setRed(hipx.getRed() + hpx.getRed());
        px.setGreen(hipx.getGreen() + hpx.getGreen());
        px.setBlue(hipx.getBlue() + hpx.getBlue());
    }
    return stegout;
}

function dosteg() {
    checkf();
    checkb();
    var hide = backup;
    var hidein = backup2;
    reset();
    crop(hide, hidein);
    prephidein(cropout);
    shiftcolor(hide);
    makesteg(shiftout, prepout);
    stegout.drawTo(can3);
}

function unsteg(hidden) {
    unstegout = new SimpleImage(hidden.getWidth(), hidden.getHeight());
    for (var px of unstegout.values()) {
        var hpx = hidden.getPixel(px.getX(), px.getY());
        px.setRed(hpx.getRed() % 16 * 16);
        px.setGreen(hpx.getGreen() % 16 * 16);
        px.setBlue(hpx.getBlue() % 16 * 16);
    }
    return unstegout;
}

function dounsteg() {
    checkf();
    var hidden = backup;
    reset();
    unsteg(hidden);
    unstegout.drawTo(can3);
}
