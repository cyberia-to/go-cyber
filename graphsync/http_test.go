package graphsync

import (
	"encoding/json"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
)

func TestHTTPServer_ServesFiles(t *testing.T) {
	s := testService(t)
	s.cfg.HTTPAddress = "localhost:0" // random port
	require.NoError(t, s.ensureDirectories())

	// Write a test meta.json into latest/
	meta := `{"chain_id":"bostrom","height":1000}`
	require.NoError(t, os.WriteFile(filepath.Join(s.latestDir(), "meta.json"), []byte(meta), 0644))

	// Start HTTP server
	s.startHTTP()
	defer s.httpServer.Close()

	// Wait briefly for server to start
	time.Sleep(50 * time.Millisecond)

	// Get the actual port
	addr := s.httpServer.Addr
	if addr == "localhost:0" {
		// Server with port 0 — we need to get the actual listener address
		// Since startHTTP uses ListenAndServe in a goroutine, we can't easily get the port
		// Use a fixed port instead for this test
		t.Skip("Cannot determine random port from ListenAndServe; use fixed port test")
	}

	resp, err := http.Get("http://" + addr + "/snapshot/latest/meta.json")
	require.NoError(t, err)
	defer resp.Body.Close()

	require.Equal(t, http.StatusOK, resp.StatusCode)

	body, err := io.ReadAll(resp.Body)
	require.NoError(t, err)

	var loaded map[string]interface{}
	require.NoError(t, json.Unmarshal(body, &loaded))
	require.Equal(t, "bostrom", loaded["chain_id"])
}

func TestHTTPServer_FixedPort(t *testing.T) {
	s := testService(t)
	s.cfg.HTTPAddress = "localhost:19876" // fixed test port
	require.NoError(t, s.ensureDirectories())

	// Write test files
	require.NoError(t, os.WriteFile(
		filepath.Join(s.latestDir(), "meta.json"),
		[]byte(`{"chain_id":"test-chain","height":5000}`),
		0644,
	))
	require.NoError(t, os.WriteFile(
		filepath.Join(s.latestDir(), "graph.pb"),
		[]byte("fake protobuf"),
		0644,
	))

	s.startHTTP()
	defer s.httpServer.Close()
	time.Sleep(50 * time.Millisecond)

	// Test meta.json
	resp, err := http.Get("http://localhost:19876/snapshot/latest/meta.json")
	require.NoError(t, err)
	defer resp.Body.Close()
	require.Equal(t, http.StatusOK, resp.StatusCode)

	body, err := io.ReadAll(resp.Body)
	require.NoError(t, err)
	require.Contains(t, string(body), "test-chain")

	// Test graph.pb
	resp2, err := http.Get("http://localhost:19876/snapshot/latest/graph.pb")
	require.NoError(t, err)
	defer resp2.Body.Close()
	require.Equal(t, http.StatusOK, resp2.StatusCode)

	body2, err := io.ReadAll(resp2.Body)
	require.NoError(t, err)
	require.Equal(t, "fake protobuf", string(body2))

	// Test 404
	resp3, err := http.Get("http://localhost:19876/snapshot/latest/nonexistent")
	require.NoError(t, err)
	defer resp3.Body.Close()
	require.Equal(t, http.StatusNotFound, resp3.StatusCode)
}
