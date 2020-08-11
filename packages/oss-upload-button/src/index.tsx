import * as React from "react";
import {Popover, Upload} from "antd";
import * as OSS from "ali-oss";
import {UploadManager} from "@netless/oss-upload-manager";
import "./index.less";
import {PPTKind, Room, WhiteWebSdk} from "white-web-sdk";
import * as upload from "./image/upload.svg";
import * as image from "./image/image.svg";
import * as uploadActive from "./image/upload-active.svg";
import * as fileTransWeb from "./image/file-trans-web.svg";
import * as fileTransImg from "./image/file-trans-img.svg";
import {ossConfigObj} from "./ossConfig";
export type OssUploadButtonStates = {
    isActive: boolean,
};

export const FileUploadStatic: string = "application/pdf, " +
    "application/vnd.openxmlformats-officedocument.presentationml.presentation, " +
    "application/vnd.ms-powerpoint, " +
    "application/msword, " +
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export type OssUploadButtonProps = {
    room: Room,
    whiteboardRef?: HTMLDivElement,
};

export default class OssUploadButton extends React.Component<OssUploadButtonProps, OssUploadButtonStates> {
    private readonly client: any;
    public constructor(props: OssUploadButtonProps) {
        super(props);
        this.state = {
            isActive: false,
        };
        this.client = new OSS({
            accessKeyId: ossConfigObj.accessKeyId,
            accessKeySecret: ossConfigObj.accessKeySecret,
            region: ossConfigObj.region,
            bucket: ossConfigObj.bucket,
        });
    }

    private uploadStatic = async (event: any): Promise<void> => {
        const {uuid, roomToken} = this.props.room;
        const uploadManager = new UploadManager(this.client, this.props.room);
        const whiteWebSdk = new WhiteWebSdk({appIdentifier: "283/VGiScM9Wiw2HJg"});
        const pptConverter = whiteWebSdk.pptConverter(roomToken);
        await uploadManager.convertFile(
            event.file,
            pptConverter,
            PPTKind.Static,
            ossConfigObj.folder,
            uuid,
          );
    }

    private uploadDynamic = async (event: any): Promise<void> => {
        const {uuid, roomToken} = this.props.room;
        const uploadManager = new UploadManager(this.client, this.props.room);
        const whiteWebSdk = new WhiteWebSdk({appIdentifier: "283/VGiScM9Wiw2HJg"});
        const pptConverter = whiteWebSdk.pptConverter(roomToken);
        await uploadManager.convertFile(
            event.file,
            pptConverter,
            PPTKind.Dynamic,
            ossConfigObj.folder,
            uuid,
        );
    }

    private uploadImage = async (event: any): Promise<void> => {
        const uploadFileArray: File[] = [];
        uploadFileArray.push(event.file);
        const uploadManager = new UploadManager(this.client, this.props.room);
        if (this.props.whiteboardRef) {
            const {clientWidth, clientHeight} = this.props.whiteboardRef;
            await uploadManager.uploadImageFiles(uploadFileArray, clientWidth / 2, clientHeight / 2);
        } else {
            const clientWidth = window.innerWidth;
            const clientHeight = window.innerHeight;
            await uploadManager.uploadImageFiles(uploadFileArray, clientWidth / 2, clientHeight / 2);
        }
    }

    private renderUploadButton = (): React.ReactNode => {
        return (
            <div className="oss-upload-box">
                <Upload
                    accept={"image/*"}
                    showUploadList={false}
                    customRequest={this.uploadImage}>
                    <div className="oss-upload-section">
                        <div className="oss-upload-section-inner">
                            <div className="oss-upload-title-section">
                                <div className="oss-upload-title">上传图片</div>
                                <div className="oss-upload-icon">
                                    <img src={image}/>
                                </div>
                            </div>
                            <div className="oss-upload-section-script">
                                <div className="oss-upload-section-text">
                                    支持常见格式，可以改变图片大小和位置。
                                </div>
                            </div>
                        </div>
                    </div>
                </Upload>
                <div style={{width: 208, height: 0.5, backgroundColor: "#E7E7E7"}}/>
                <Upload
                    accept={"application/vnd.openxmlformats-officedocument.presentationml.presentation"}
                    showUploadList={false}
                    customRequest={this.uploadDynamic}>
                    <div className="oss-upload-section">
                        <div className="oss-upload-section-inner">
                            <div className="oss-upload-title-section">
                                <div className="oss-upload-title">资料转网页</div>
                                <div className="oss-upload-icon">
                                    <img src={fileTransWeb}/>
                                </div>
                            </div>
                            <div className="oss-upload-section-script">
                                <div className="oss-upload-section-text">支持 pptx 格式，如果是 ppt 格式，请手动转换。</div>
                            </div>
                        </div>
                    </div>
                </Upload>
                <div style={{width: 208, height: 0.5, backgroundColor: "#E7E7E7"}}/>
                <Upload
                    accept={FileUploadStatic}
                    showUploadList={false}
                    customRequest={this.uploadStatic}>
                    <div className="oss-upload-section">
                        <div className="oss-upload-section-inner">
                            <div className="oss-upload-title-section">
                                <div className="oss-upload-title">文档转图片</div>
                                <div className="oss-upload-icon">
                                    <img src={fileTransImg}/>
                                </div>
                            </div>
                            <div className="oss-upload-section-script">
                                <div className="oss-upload-section-text">Support ppt、pptx、word and pdf.</div>
                            </div>
                        </div>
                    </div>
                </Upload>
            </div>
        );
    }


    private handleVisibleChange = (event: boolean): void => {
        this.setState({isActive: event})
    }

    public render(): React.ReactNode {
        const {isActive} = this.state;
        return (
            <Popover trigger="click"
                     onVisibleChange={this.handleVisibleChange}
                     placement={"leftBottom"}
                     content={this.renderUploadButton()}>
                <div className="oss-upload-cell-box-left">
                    <div className="oss-upload-cell">
                       <img src={isActive ? uploadActive: upload}/>
                    </div>
                </div>
            </Popover>
        );
    }
}