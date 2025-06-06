package gapi

import (
	"context"
	"net/http"
	"time"

	"github.com/rs/zerolog/log"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func GrpcLogger(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (resp interface{}, err error) {
	startTime := time.Now()

	rsp, err := handler(ctx, req)

	duration := time.Since(startTime)

	statusCode := codes.Unknown
	if st, ok := status.FromError(err); ok {
		statusCode = st.Code()
	}

	logger := log.Info()
	if err != nil {
		logger = log.Error().Err(err)
	}

	logger.Str("protocol", "gRPC").Str("method", info.FullMethod).Int("status_code", int(statusCode)).Str("status_text", statusCode.String()).Dur("duration", duration).Msg("gRPC request processed")

	return rsp, err
}

type ResponseRecorder struct {
	http.ResponseWriter
	StatusCode int
	Body       []byte
}

func (rec *ResponseRecorder) WriteHeader(statuscode int) {
	rec.StatusCode = statuscode
	rec.ResponseWriter.WriteHeader(statuscode)
}

func (rec *ResponseRecorder) Write(b []byte) (int, error) {
	rec.Body = b
	return rec.ResponseWriter.Write(b)
}

func HttpLogger(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		startTime := time.Now()
		rec := &ResponseRecorder{
			ResponseWriter: w,
			StatusCode:     http.StatusOK,
		}

		handler.ServeHTTP(rec, r)

		duration := time.Since(startTime)

		logger := log.Info()
		if rec.StatusCode != http.StatusOK {
			logger = log.Error().Bytes("body", rec.Body)
		}

		logger.Str("protocol", "HTTP").Str("method", r.Method).Str("url", r.RequestURI).Int("status_code", rec.StatusCode).Str("status_text", http.StatusText(rec.StatusCode)).Dur("duration", duration).Msg("HTTP request processed")
	})
}
