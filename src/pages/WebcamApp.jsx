import React, { useEffect, useRef, useState, useCallback } from 'react';
import styled from 'styled-components';
import Webcam from 'react-webcam';
import LoadingPage from './Loding';

// 비디오 콘테이너
const videoConstraints = {
  width: 1001,
  height: 641,
  facingMode: 'user',
};
const style2 = {
  width: 219.98,
  height: 140.77,
  left: 1043.56,
  top: 300.68,
  background: 'white',
  marginLeft: 38.56,
  backgroundSize: 'cover',
};

const WebcamApp = () => {
  const maxCount = 8;
  const [count, setCount] = useState(0);
  // 촬영 후 이미지를 보여주는지 여부
  const [showResult, setShowResult] = useState(false);
  // 촬영한 사진 배열
  const [images, setImages] = useState([]);
  // 6초 촬영 타이머
  const [timeLeft, setTimeLeft] = useState(3); //수정
  // 6초 감소 시킬 timeRef
  const timeRef = useRef(Date.now());
  // webcam
  const webcamRef = useRef(null);
  
  const [newQ, setNewQ] = useState(Array(4).fill(null));

  const [showLoadingPage, setShowLoadingPage] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    const audioElement = new Audio('sound-effect.mp3');
    audioRef.current = audioElement;
  
    return () => {
      audioElement.pause();
      audioElement.currentTime = 0;
    };
  }, []);
  
  const playSoundEffect = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  }, []);
  
  useEffect(() => {
    setShowWebcam(true);
    setShowLoadingPage(true);
    setTimerStarted(true);

    const webcamTimeout = setTimeout(() => {
      setShowLoadingPage(false);
    }, 3000);

    return () => clearTimeout(webcamTimeout);
  }, []);

  const q = useCallback(
    (data) => {
      setNewQ((prevQ) => {
        let newQ = [...prevQ];
        if(newQ.every((item) => item === null)){
          newQ[0] = data;
        }else if(newQ[1] == null) {
          newQ[1] = data;
        }else if(newQ[2] == null){
          newQ[2] = data;
        }else if(newQ[3] == null){
          newQ[3] = data;
        }
        else if (newQ.length === 4 && !newQ.every((item) => item === null)) {
          newQ.shift();
          newQ.push(data);
        }
        localStorage.setItem('selectedImages', JSON.stringify(newQ));
        return newQ;
      });
    },
    []
  );

  const renderQueue = useCallback(
    (queue) => {
      return queue.map((selectedImage, index) => {
        const key = `${selectedImage}_${index}`;
        return (
          <div
            key={key}
            style={{
              ...style2,
              backgroundImage: selectedImage ? `url("${selectedImage}")` : null,
            }}
          ></div>
        );
      });
    },
    [newQ]
  );

  useEffect(() => {
    const storedImages = JSON.parse(localStorage.getItem('selectedImages'));
    if (storedImages) {
      setNewQ(storedImages);
    }
  }, []);

  useEffect(() => {
    webcamRef.current = document.createElement('video');
  }, []);

  const capture = useCallback(async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImages((imgs) => [...imgs, imageSrc]);
      setCount((c) => {
        if (c === maxCount - 1) {
          setShowResult(true);
        }
        return c + 1;
    });
    playSoundEffect(); // 효과음 재생
  }
  }, [webcamRef, maxCount]);
  
  // 타임에 맞추어 타이머 돌리기 
  useEffect(() => {
    if (timerStarted) {
      const timeoutId = setTimeout(() => {
        const intervalId = setInterval(() => {
          setTimeLeft((prevTimeLeft) => {
            const newTimeLeft = Math.max(0, prevTimeLeft - 0.3); //수정
            if (newTimeLeft === 0) {
              clearInterval(intervalId);
              capture();
            }
            return newTimeLeft;
          });
        }, 300); //수정
    
        return () => clearInterval(intervalId);
      }, 3500);
  
      return () => clearTimeout(timeoutId);
    }
  }, [capture, timerStarted]);
  

  // 8장 이하로 촬영하기 
  useEffect(() => {
    const timer = setTimeout(() => {
      if (images.length < 8) {
        capture();
        setTimeLeft(3); //수정 
        timeRef.current = Date.now();
      }
    }, timeLeft * 3500);

    return () => clearTimeout(timer);
  }, [images, capture, timeLeft]);

  const [imagescount, setImagesCount] = useState([]);

  const handleClick = (image) => {
    if (imagescount.length >= 4) {
      setImagesCount((prevImages) => prevImages.slice(1));
    }
    setImagesCount((prevImages) => [...prevImages, image]);
  };

  // imagescount의 배열길이가 4라면 다음 버튼 활성화 시키기
  useEffect(() => {
    if (imagescount.length === 4) {
      document.documentElement.style.setProperty('--links-color', 'black');
    } else {
      document.documentElement.style.setProperty('--links-color', '#BDBDBD');
    }
  }, [imagescount]);

  // photoshoot 경로에서만 실행되게 하기 
  const pathname = window.location.pathname;
  if (pathname.includes('/photoshoot')) {
    if (showResult) {
      return (
        <>
          <div style={{ fontSize: 24, textAlign: 'center', fontWeight: 600, marginTop: 40, fontFamily: 'Noto Serif'}}>
            사진을 선택해주세요
          </div>
          <Frames>
            <Choice>
              {images.map((i, index) => (
                <div>
                <Img src="Vector1.png" alt="Thumbnail 1" onClick={() => handleClick(i)} style={{ display: imagescount.includes(i) ? "block" : "none" }}/>
                <img key={index} src={i} onClick={() => { q(i); handleClick(i)}} style={{width: 219.98, height:140.77 }} />
                </div>
              ))}
            </Choice>
            <div style={{ position: 'absolute', width: 583, height:683, left:105, top:206, background:'#000000',marginLeft:900, marginTop:60,}}>
                <div style={{display:'grid', gridTemplateColumns:'219.98px', gridRowGap:9, marginTop: 17}} id='print'>
                {renderQueue(newQ)}
                </div>
              </div>
            </Frames>
            <Btn>
            <Links href="/ChoiceFrame">다음&nbsp;&nbsp;&nbsp;〉</Links>
            </Btn>
            </>
        )
    }
  }
    return (
        <div>
            <div style={{margin:'0 auto', background:'white', width: 1820, height:967, left: 50, top: 130, backgroundBlendMode: 'overlay', borderRadius: '30px 30px 0px 0px',boxShadow: '0px 0px 49px 3px #F5F5F5', marginTop:70}}>
              <br />
               <div style={{display:'flex', justifyContent:'center', alignItems: 'center', fontSize: 40}}>{`${count}/${maxCount}`}</div>
               <div style={{display:'flex', justifyContent:'center', alignItems: 'center', fontSize: 70}}>{Math.round(timeLeft)}</div>
               <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
               <div>
                {showLoadingPage && <LoadingPage />}
                {showWebcam && (
                  <>
                    <Webcam
                      style={{width: 1001,height: 641,background: 'black',marginTop: 60,}}
                      audio={false}
                      height={720}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      width={1280}
                      videoConstraints={videoConstraints}/>
                  </>
                )}
                </div>
                </div>
            </div>
            <br />
        </div>
    );
}

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(<WebcamApp />);

const Links = styled.a`
  font-size: 20px;
  font-family: 'Noto Serif';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 27px;
  color: var(--links-color, #BDBDBD);
  width: 196px;
  height: 60px;
  text-decoration: none;
  text-align: center;
`;
const Btn = styled.button`
  position: absolute;
  border-radius: 30px;
  width: 196px;
  height: 60px;
  left: 1633px;
  top: 980px;
  background-blend-mode: overlay;
  background: white;
  box-shadow: 0px 0px 2px 2px #F5F5F5;
  border: none;
  padding: 10px 10px 10px 10px;

`;
const Frames = styled.div`
    margin: 0 auto;
    marginTop: 23px;
    background: white;
    width: 1820px;
    height: 967px;
    left: 50px;
    top: 190px;
    background-blend-mode: overlay;
    border-radius: 30px 30px 0px 0px;
    box-shadow: 0px 0px 49px 3px #F5F5F5;
    margin-top: 15px;
`;
const Choice = styled.div`
    display: grid;
    grid-template-columns: 245px 245px;
    margin-left: 262px;
    margin-top: 94px;
    position: absolute;
    column-gap: 10px;
    grid-column-gap: 45px;
    grid-row-gap:35px;
    `;
    const Img = styled.img`
      position: absolute;
      width: 45px; 
      height:45px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin : 0 auto;
      margin: 66px 95px 30px 84px;
`;
export default WebcamApp;