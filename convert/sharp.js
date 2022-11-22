const sharp = require('sharp');
const fs = require('fs');
const gify = require('gify');
const { Readable } = require('stream');

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

		return image;
	} catch(err) {
		console.log(err);
        return;
	}
};

const rotateImage = async (img, rotate = 90) => {
	try { 
		const image = await sharp(img, { failOnError: false })
		.rotate(rotate)
		.toBuffer();

		return image;
	} catch(err) {
		console.log(err);
        return;
	}
};

const addMem = async(img) => {
	try {
 		const width = 150;
		const height = 100;
		const text = "E.T, go home";

		const svgText = `
		<svg width="${width}" height="${height}">
			<style>
			.title { fill: red; font-size: 25px}
			</style>
			<text x="45%" y="40%" text-anchor="middle" class="title">${text}</text>
		</svg>`;

		const svgBuffer = Buffer.from(svgText);

		const image = await sharp(img, { limitInputPixels: false })
			.composite([{input: svgBuffer, left: 50, top: 90}])
			.toBuffer();
  		return image;
  	} catch(err) {
		console.log(err);
        return;
	}
};

const addWatermark = async (img) => {
  try {
		const watermarkBuffer = fs.readFileSync(__dirname + "/watermark.jpeg");
		
		const image = await sharp(img, { limitInputPixels: false })
  		.composite([{
          input: watermarkBuffer,
          top: 50,
          left: 50,
        },])
  		.toBuffer();

		return image;
  } catch (error) {
    console.log(error);
  }
};

const compressImg = async (img, type = 'png') => {
	try { 
		const image = await sharp(img, { limitInputPixels: false })
		.toFormat(type)
		.jpeg({
			quality: 40,
			force: false,
		})
		.toBuffer();

		return image;
	} catch(err) {
		console.log(err);
        return;
	}
};

const videoToGif = async (video) => {
	const opts = {
  		height: 300,
		rate: 10
	};

	console.time('convert');
	gify(video, '../public/out.gif', opts, (err) => {
		if (err) throw err;
		console.timeEnd('convert');
		const s = fs.statSync('../public/out.gif');
		console.log('size: %smb', s.size / 1024 / 1024 | 0);

		return s;
	});
};

const convertAction = async (type, img, typeImg = '') => {
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
	if(type === 'addWatermark') {
		imageR = await addWatermark(img);
	}
	if(type === 'compressImg') {
		imageR = await compressImg(img, typeImg);
	}
	if(type === 'videoToGif') {
		imageR = await videoToGif(img);
	}

	return imageR;
};

module.exports = { convertAction };