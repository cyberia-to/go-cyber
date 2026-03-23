package graphsync

import (
	"net/http"
	"path/filepath"
)

func (s *SyncService) startHTTP() {
	snapshotDir := filepath.Join(s.homePath, "data", "snapshots")

	mux := http.NewServeMux()
	mux.Handle("/snapshot/", http.StripPrefix("/snapshot/", http.FileServer(http.Dir(snapshotDir))))

	s.httpServer = &http.Server{
		Addr:    s.cfg.HTTPAddress,
		Handler: mux,
	}

	go func() {
		s.logger.Info("Graph sync HTTP server starting", "address", s.cfg.HTTPAddress)
		if err := s.httpServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			s.logger.Error("Graph sync HTTP server error", "err", err)
		}
	}()
}
