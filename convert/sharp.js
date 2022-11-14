const sharp = require('sharp');

const resize = async (img) => {
	try { 
		const image = await sharp(img, { limitInputPixels: false }).resize(50, 50).toBuffer();
		console.log('resize finish');
		return image;
	} catch(err) {
		console.log(err);
        return;
	}
};

const typeJpg = async (img) => {
	try { 
		const image = await sharp(img, { limitInputPixels: false })
		.toFormat('jpeg')
		.jpeg({
			quality: 100,
			chromaSubsampling: '4:4:4',
			force: true,
		})
		.toBuffer();

		return image;
	} catch(err) {
		console.log(err);
        return;
	}
};

const typePng = async (img) => {
	try { 
		const image = await sharp(img, { limitInputPixels: false })
		.toFormat('png', {palette: true})
		.toBuffer();

		return image;
	} catch(err) {
		console.log(err);
        return;
	}
};

const cropImage = async (img, left = 100, width = 100, height = 100, top = 100) => {
	try { 
		const image = await sharp(img, { limitInputPixels: false })
		.extract({left: left, width: width, height: height, top: top})
		.toBuffer();
console.log('cropImage finish');
		return image;
	} catch(err) {
		console.log(err);
        return;
	}
};

const rotateImage = async (img) => {
	try { 
		const image = await sharp(img, { limitInputPixels: false })
		.rotate()
		.toBuffer();

		return image;
	} catch(err) {
		console.log(err);
        return;
	}
};

const addMem =  async(img) => {
  const width = 900;
  const height = 500;
  const text = "E.T, go home";

  const svgText = `
  <svg width="${width}" height="${height}">
    <style>
      .title { fill: red; font-size: 85px}
    </style>
    <text x="45%" y="40%" text-anchor="middle" class="title">${text}</text>
  </svg>`;

  const svgBuffer = Buffer.from(svgText);

  const image = await sharp(img, { limitInputPixels: false })
  	.composite([{input: svgBuffer, left: 1150, top: 90}])
  	.toBuffer();
  return image;
}

const convertAction = async (type, img) => {
	let imageR;
	if(type === 'resize') {
		imageR = await resize(img);
	}
	if(type === 'typeJpg') {
		imageR = await typeJpg(img);
	}
	if(type === 'typePng') {
		imageR = await typePng(img);
	}
	if(type === 'cropImage') {
		imageR = await cropImage(img);
	}
	if(type === 'rotateImage') {
		imageR = await rotateImage(img);
	}
	if(type === 'addMem') {
		imageR = await addMem(img);
	}

	return imageR;
}

module.exports = { convertAction };