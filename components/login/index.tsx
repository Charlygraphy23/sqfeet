/* eslint-disable prettier/prettier */
import Image from 'next/image';
import LoginBottomSection from './components/loginBottom';

const Login = () => (
    <div className='login'>
        <div className='login__container'>
            <div
                id='carouselExampleIndicators'
                className='carousel slide'
                data-bs-ride='true'
            >
                <div className='carousel-indicators'>
                    <button
                        type='button'
                        data-bs-target='#carouselExampleIndicators'
                        data-bs-slide-to='0'
                        className='active'
                        aria-current='true'
                        aria-label='Slide 1'
                    />
                    <button
                        type='button'
                        data-bs-target='#carouselExampleIndicators'
                        data-bs-slide-to='1'
                        aria-label='Slide 2'
                    />
                    <button
                        type='button'
                        data-bs-target='#carouselExampleIndicators'
                        data-bs-slide-to='2'
                        aria-label='Slide 3'
                    />
                </div>
                <div className='carousel-inner'>
                    <div className='carousel-item active'>
                        <div className='image__container'>
                            <Image src='/assets/img1.svg' alt='...' layout='fill' />
                        </div>
                    </div>
                    <div className='carousel-item'>
                        <div className='image__container'>
                            <Image src='/assets/img2.svg' alt='...' layout='fill' />
                        </div>
                    </div>
                    <div className='carousel-item'>
                        <div className='image__container'>
                            <Image src='/assets/img3.svg' alt='...' layout='fill' />
                        </div>
                    </div>
                </div>
            </div>

            <LoginBottomSection />
        </div>
    </div>
);

export default Login;
