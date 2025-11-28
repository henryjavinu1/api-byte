import dotenv from 'dotenv';
dotenv.config();

export const envs = {
	PORT: process.env.PORT,
	API_KEY: process.env.API_KEY,

	DB: {
		HOST: process.env.DB_HOST,
		PORT: Number(process.env.DB_PORT),
		NAME: process.env.DB_NAME,
		USER: process.env.DB_USER,
		PASSWORD: process.env.DB_PASSWORD,
		SSL: process.env.DB_SSL,
	},
};
