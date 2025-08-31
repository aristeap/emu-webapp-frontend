import * as angular from 'angular';

class VideoParserService {
    private $q;
    private $window;

    constructor($q, $window) {
        this.$q = $q;
        this.$window = $window;
    }

    parseVideoAudioBuf(buf) {
        try {
            const AudioContext = this.$window.OfflineAudioContext || this.$window.webkitOfflineAudioContext;
            const numChannels = 2;
            const sampleRate = 44100;
            const totalSamples = buf.byteLength / 2 / numChannels;
            const offlineCtx = new AudioContext(numChannels, totalSamples, sampleRate);

            let defer = this.$q.defer();
            offlineCtx.decodeAudioData(buf,
                function(decodedData) {
                    defer.resolve(decodedData);
                },
                function(error) {
                    defer.reject(error);
                }
            );
            return defer.promise;
        } catch (e) {
            let err = {
                status: {
                    message: JSON.stringify(e, null, 4)
                }
            };
            let defer = this.$q.defer();
            defer.reject(err);
            return defer.promise;
        }
    }
}

angular.module('emuwebApp')
.service('VideoParserService', ['$q', '$window', VideoParserService]);