import {
  ChangeEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import classNames from "classnames";

type IDeviceList = Record<string, MediaDeviceInfo[]>;

const PreviewRoom = () => {
  const [deviceList, setDeviceList] = useState<IDeviceList>({});
  const [audioUpStream, setAudioUpStream] = useState<MediaStream | null>(null);
  const [videoUpStream, setVideoUpStream] = useState<MediaStream | null>(null);
  const [videoMuted, setVideoMuted] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [audioInputDeviceId, setAudioInputDeviceId] = useState("default");
  const [videoInputDeviceId, setVideoInputDeviceId] = useState("default");
  const [audioOutputDeviceId, setAudioOutputDeviceId] = useState("default");

  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { conferenceId } = useParams();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    getAudioStream();
    getVideoStream();
    getDeviceList();
  }, []);

  useEffect(() => {
    if (!videoInputDeviceId) return;
    getVideoStream();
  }, [videoInputDeviceId]);

  useEffect(() => {
    if (!videoRef.current || !videoUpStream) return;
    videoRef.current.srcObject = videoUpStream;
    videoRef.current.play();
  }, [videoUpStream]);

  const handleResize = () => {
    if (!containerRef.current || !videoRef.current) return;
    let { clientWidth } = containerRef.current;
    let height = (9 / 16) * clientWidth;
    videoRef.current.style.width = `${clientWidth}px`;
    videoRef.current.style.height = `${height}px`;
    if (isLoading) setIsLoading(false);
  };

  const getAudioStream = async () => {
    try {
      let stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      setAudioUpStream(stream);
    } catch (error) {
      setAudioMuted(true);
    }
  };

  const getVideoStream = async () => {
    if (!videoRef.current) return;

    try {
      let stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          deviceId: videoInputDeviceId || "default",
          aspectRatio: 16 / 9,
        },
      });
      setVideoUpStream(stream);
    } catch (error) {
      setVideoMuted(true);
    }
  };

  const getDeviceList = async () => {
    try {
      let devices = await navigator.mediaDevices.enumerateDevices();
      let deviceList: Record<string, MediaDeviceInfo[]> = {};

      for (let device of devices) {
        if (!deviceList[device.kind]) deviceList[device.kind] = [];
        deviceList[device.kind].push(device);
      }

      setDeviceList(deviceList);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const handleDeviceChange = (event: ChangeEvent<HTMLSelectElement>) => {
    let kind = event.target.dataset.kind;
    let deviceId = event.target.value;

    if (!kind || !deviceId) return;

    if (kind === "videoinput") setVideoInputDeviceId(deviceId);
    else if (kind === "audioinput") setAudioInputDeviceId(deviceId);
    else if (kind === "audiooutput") setAudioOutputDeviceId(deviceId);
  };

  const handleJoinConference = () => {
    console.log("join", conferenceId);
  };

  return (
    <div className="container h-full place-content-center grid grid-cols-preview gap-5 mx-auto">
      <div
        className={classNames("flex flex-col gap-4", {
          invisible: isLoading,
        })}
      >
        <div ref={containerRef} className="relative rounded">
          <video ref={videoRef} className="rounded -scale-x-100"></video>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
            <button>Mute</button>
            <button>Unmute</button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <select
            className="h-10 rounded outline-none"
            value={videoInputDeviceId}
            data-kind="videoinput"
            onChange={handleDeviceChange}
          >
            {deviceList.videoinput &&
              deviceList.videoinput.map(({ deviceId, label }) => {
                return (
                  <option key={deviceId} value={deviceId}>
                    {label}
                  </option>
                );
              })}
          </select>
          <select
            className="h-10 rounded outline-none"
            value={audioInputDeviceId}
            data-kind="audioinput"
            onChange={handleDeviceChange}
          >
            {deviceList.audioinput &&
              deviceList.audioinput.map(({ deviceId, label }) => {
                return (
                  <option key={deviceId} value={deviceId}>
                    {label}
                  </option>
                );
              })}
          </select>
          <select
            className="h-10 rounded outline-none"
            value={audioOutputDeviceId}
            data-kind="audiooutput"
            onChange={handleDeviceChange}
          >
            {deviceList.audiooutput &&
              deviceList.audiooutput.map(({ deviceId, label }) => {
                return (
                  <option key={deviceId} value={deviceId}>
                    {label}
                  </option>
                );
              })}
          </select>
        </div>
      </div>
      <div className="flex flex-col gap-6 justify-center items-center">
        <span className="text-2xl text-black">What's your name?</span>
        <div className="h-14 w-2/3">
          <input
            onChange={handleChange}
            className="h-full w-full px-4 border-none outline outline-1 outline-gray-400 rounded focus:outline-dark-blue focus:outline-2"
            placeholder="Your name"
            value={userName}
          />
        </div>
        <button
          className={classNames(
            "text-lg  w-28 h-12 rounded-full disabled:shadow-none shadow-[0_1px_2px_0_rgba(60,64,67,.3),_0_1px_3px_1px_rgba(60,64,67,.15)]",
            userName ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-400"
          )}
          disabled={!userName}
          onClick={handleJoinConference}
        >
          Join
        </button>
      </div>
    </div>
  );
};

export default PreviewRoom;
