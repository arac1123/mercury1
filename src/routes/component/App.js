import { StyleSheet, Text, View, Dimensions, Button  } from 'react-native';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { Camera } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import {Svg, Circle} from 'react-native-svg';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Location from 'expo-location';
import { Alert } from 'react-native';
import { Audio } from 'expo-av';
import url from '../../url';

export const myValueObject = {
  myValue: 0,
  setmyValue: () => {}
};

function App() {
  
  const [hasPermission, setHasPermission] = React.useState();
  const [faceData, setFaceData] = React.useState([]);
  const [eyeStatus, setEyeStatus] = React.useState('');
  const [yawningStatus, setYawningStatus] = React.useState('');
  const [pupilDirection, setPupilDirection] = React.useState('');
  const [blinkCount, setBlinkCount] = React.useState(0);
  const [yawnCount, setYawnCount] = React.useState(0);
  const [viewBox, setViewBox] = React.useState('0 0 1 1');
  const [lastYawnTime, setLastYawnTime] = React.useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [speed, setSpeed] = useState(0);
  const [lastBlinkTime, setLastBlinkTime] = React.useState(null);
  const [lastLookTime, setLastLookTime] = React.useState(null);
  const [blinkAlertShown, setBlinkAlertShown] = useState(false);
  const [lookAlertShown, setLookAlertShown] = useState(false);
  const [yawnAlertShown, setYawnAlertShown] = useState(false);
  const [datetime, setDatetime] = useState(new Date());
  const [myValue,setmyValue] = React.useState(0);


  useEffect(() => {
    (async () => {
      //相機許可
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
      if (Camera.Constants.PreviewWidth && Camera.Constants.PreviewHeight) {
        setViewBox(`0 0 ${Camera.Constants.PreviewWidth} ${Camera.Constants.PreviewHeight}`);
      }

      // 位置和速度許可
      let { status: locStatus } = await Location.requestForegroundPermissionsAsync();
      if (locStatus !== 'granted') {
        setErrorMsg('Permission to access location was denied');
      } else {
        const subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 500,
            distanceInterval: 0,
          },
          (newLocation) => {
            setLocation(newLocation);
            if (newLocation.coords.speed !== -1) {
              setSpeed(newLocation.coords.speed * 3.6);
            }
          }
        );

        return () => {
          subscription.remove();
        };
      }
    })();
  }, []);

  // 每60秒計時器
  useEffect(() => {
    const timer = setInterval(() => {
      setDatetime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // 眨眼次數、打哈欠次數警報
  useEffect(() => {
    if (blinkCount >= 3 && !blinkAlertShown) {
      Alert.alert("警告", "您眨眼的次數過多，請保持警覺");
      //recordadd();
      setBlinkCount(0);
      setBlinkAlertShown(true);
    }

    if (yawnCount >= 3 && !yawnAlertShown) {
      Alert.alert("警告", "您打哈欠的次數過多，請保持警覺");
      setYawnCount(0);
      setYawnAlertShown(true);
    }
  }, [blinkCount, yawnCount]);




  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  //重置打哈欠及眨眼次數
  const resetCounts = () => {
    setBlinkCount(0);
    setYawnCount(0);
  };

  //偵測點座標位置
  const renderFacePoints = (face) => {
    const landmarks = [
      'leftEyePosition',
      'rightEyePosition',
      'leftMouthPosition',
      'rightMouthPosition',
      'leftEarPosition',
      'rightEarPosition',
      'leftCheekPosition',
      'rightCheekPosition',
      'noseBasePosition',
  ];

    return landmarks.map((landmark, index) => (
      <Circle
        key={index}
        cx={face[landmark].x}
        cy={face[landmark].y}
        r={2}
        stroke="blue"
        strokeWidth={2}
        fill="blue"
      />
    ));
  };

  //速度搭配左右看以及閉眼時間
  const getAllowedBlinkAndLookTime = () => {
    if (speed < 20) {
      return 5000;
    } else if (speed < 40) {
      return 4000;
    } else  if (speed < 60){
      return 3000;
    }
    else if(speed < 80){
      return 2000;
    }
    else{
      return 1000;
    }
  };

  //臉部偵測顯示資訊在螢幕上
  function getFaceDataView() {
    if (faceData.length === 0) {
      return (
        
        <View style={styles.faces}>
          <Text style={styles.faceDesc}>No face!</Text>
        </View>
      );
      
    } else {
      return (
        <View style={styles.faces}>
          <Text style={styles.faceDesc}>Eye status: {eyeStatus}</Text>
          <Text style={styles.faceDesc}>Yawning status: {yawningStatus}</Text>
          <Text style={styles.faceDesc}>Pupil direction: {pupilDirection}</Text>
          <Text style={styles.faceDesc}>Blink count: {blinkCount}</Text>
          <Text style={styles.faceDesc}>Yawn count: {yawnCount}</Text>
        </View>
      );

    }
  }

  // 眨眼、閉眼偵測
  const detectBlinking = (face) => {
    const leftEyeOpen = face.leftEyeOpenProbability > 0.8;
    const rightEyeOpen = face.rightEyeOpenProbability > 0.8;

    if (leftEyeOpen && rightEyeOpen) {
      return 'Open';
    } else if (!leftEyeOpen && !rightEyeOpen) {
      return 'Closed';
    } else {
      return 'Winking';
    }
  };

  // 打哈欠偵測
  const detectYawning = (face) => {
    if (!face.leftMouthPosition || !face.rightMouthPosition || !face.bottomMouthPosition || !face.leftCheekPosition || !face.rightCheekPosition) {
      return 'Not available';
    }

    const mouthWidth = Math.abs(face.rightMouthPosition.x - face.leftMouthPosition.x);
    const mouthTopY = (face.leftMouthPosition.y + face.rightMouthPosition.y) / 2;
    const mouthHeight = Math.abs(face.bottomMouthPosition.y - mouthTopY);

    const cheekDistance = Math.abs(face.rightCheekPosition.x - face.leftCheekPosition.x);
    const cheekMouthWidthRatio = mouthWidth / cheekDistance;

    const yawning = mouthHeight / mouthWidth > 0.4 && cheekMouthWidthRatio > 0.3;
    return yawning ? 'Yawning' : 'Not yawning';
  };

  // 瞳孔位置偵測
  const detectPupilDirection = (face) => {
    if (!face.leftEyePosition || !face.rightEyePosition || !face.noseBasePosition) {
      return 'Not available';
    }

    const leftEyeX = face.leftEyePosition.x;
    const rightEyeX = face.rightEyePosition.x;
    const noseX = face.noseBasePosition.x;

    if (leftEyeX < noseX && rightEyeX > noseX) {
      return 'Looking forward';
    } else if (leftEyeX > noseX && rightEyeX < noseX) {
      return 'Looking backward';
    } else if (leftEyeX > noseX && rightEyeX > noseX) {
      return 'Looking left';
    } else {
      return 'Looking right';
    }
  };


  // recordadd=()=>{
  //   const time = new Date(`1970-01-01T08:00:00.000Z`);
  //   const starttime = new Date(datetime.getTime()+ time.getTime()-new Date(0).getTime());
  //   console.log(starttime.toISOString());
  //   fetch(`http://${url}/uploadData`, {
  //     method: "POST",
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       data: {
  //         value1: starttime.toISOString(),
  //         value3: "眨眼次數過多",
  //       },
  //     }),
  //   })
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       return response.json();
  //     })
  //     .catch((error) => {
  //       console.error("There was a problem with the fetch operation:", error);
  //     });
  //   }

    // test=()=>{

    //   fetch(`http://${url}/selectrecord?name=沈柏寧`)
    //   .then(response=>response.json())
    //   .then(response=>{console.log(response)});
    // }




  // main code
  const handleFacesDetected = ({ faces }) => {
    setFaceData(faces);
    // console.log(faces[0]);
    // console.log(faces[0]["leftMouthPosition"]);
    // console.log(faces[0]["rightMouthPosition"]);
    if (faces.length > 0) {
      setmyValue(1);
      myValueObject.myValue = myValue;

      if(true)
      {
        const face = faces[0];
        const currentEyeStatus = detectBlinking(face);
        const currentYawningStatus = detectYawning(face);
        const currentTime = new Date().getTime();
        const allowedTime = getAllowedBlinkAndLookTime();
        setEyeStatus(detectBlinking(face));
        setYawningStatus(detectYawning(face));
        setPupilDirection(detectPupilDirection(face));

        if (currentEyeStatus === "Closed" || currentEyeStatus === "Winking") {
          if (!lastBlinkTime) {
            setLastBlinkTime(currentTime);
          } else if (currentTime - lastBlinkTime >= allowedTime) {
            if (!blinkAlertShown) {
              //要換
              Alert.alert("警告", "您閉眼的時間過長，請保持警覺");
              setBlinkAlertShown(true);
            }
            setLastBlinkTime(currentTime);
          }
        } else {

          setLastBlinkTime(null);
          setBlinkAlertShown(false);
        }

        if (pupilDirection === "Looking left" || pupilDirection === "Looking right") {
          if (!lastLookTime) {
            setLastLookTime(currentTime);
          } else if (currentTime - lastLookTime >= allowedTime) {
            if (!lookAlertShown) {
              //要換
              Alert.alert("警告", "您看向左右的時間過長，請保持警覺");
              setLookAlertShown(true);
            }
            setLastLookTime(currentTime);
          }
        } else {
          setLastLookTime(null);
          setLookAlertShown(false);
        }



        if ((currentEyeStatus === 'Winking' || currentEyeStatus === 'Closed') && eyeStatus !== 'Closed' && eyeStatus !== 'Winking') {
          setBlinkCount((prevCount) => prevCount + 1);
        }

        if (currentYawningStatus === 'Yawning' && yawningStatus !== 'Yawning') {
          const currentTime = new Date().getTime();
          if (!lastYawnTime || currentTime - lastYawnTime >= 1000) {
            setYawnCount((prevCount) => prevCount + 1);
            setLastYawnTime(currentTime);
          }
        }

        setEyeStatus(currentEyeStatus);
        setYawningStatus(currentYawningStatus);
      }
    } else {
      setmyValue(0);
      myValueObject.myValue = myValue;

      resetCounts();
      setEyeStatus('');
      setYawningStatus('');
      setPupilDirection('');
    }

  };

  return (
    <Camera
      type={Camera.Constants.Type.front}
      style={styles.camera}
      onFacesDetected={handleFacesDetected}
      faceDetectorSettings={{
        mode: FaceDetector.FaceDetectorMode.fast,
        detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
        runClassifications: FaceDetector.FaceDetectorClassifications.all,
        minDetectionInterval: 100,
        tracking: true
      }}>
      {getFaceDataView()}
      {faceData.map((face, index) => (
        <Svg
          key={index}
          width="100%"
          height="100%"
          viewBox={`0 0 ${Dimensions.get('window').width} ${Dimensions.get('window').height}`}
          style={styles.faceOverlay}>
          {renderFacePoints(face)}
        </Svg>
      ))}
      <View style={styles.speedContainer}>
        <Text style={styles.speedText}>
          {errorMsg
            ? errorMsg
            : speed
            ? `Speed: ${speed.toFixed(2)} km/h`
            : 'Calculating speed...'}
        </Text>
        <Button title='test' onPress={()=>{console.log(myValue)}} />
      </View>
    </Camera>

  );

}

// css
const styles = StyleSheet.create({
  camera: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faces: {
    top:-300,
    backgroundColor: '#ffffff',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16
  },
  faceDesc: {
    top:0,
    fontSize: 20
  },
  faceOverlay: {

    position: 'absolute',
    left: 0,
    top: 0,
  },
  speedContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 10,
  },
  speedText: {
    fontSize: 20,
  },
});

export default App;