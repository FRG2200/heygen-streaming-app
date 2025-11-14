async handleSpeak() {
  const message = this.elements.messageInput?.value?.trim();
  if (!message) {
    this.showError('Please enter a message');
    return;
  }

  this.updateStatus("Generating video...");
  this.showLoading();

  try {
    // 🔥 Aichi の Vercel API に送信
    const apiRes = await fetch("/api/did/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message })
    });

    const result = await apiRes.json();

    // D-ID が返す「動画URL or streamURL」を取得
    const streamUrl = result.stream_url || result.result_url || result.url;

    if (!streamUrl) {
      throw new Error("D-ID did not return a stream URL");
    }

    // 🔥 avatar-video に動画をセットして再生
    if (this.elements.videoElement) {
      this.elements.videoElement.src = streamUrl;
      this.elements.videoElement.play().catch(err => {
        console.error("Video autoplay blocked:", err);
      });
    }

    this.updateStatus("Avatar is speaking...");
    this.elements.messageInput.value = "";

  } catch (error) {
    console.error("D-ID Speak Error:", error);
    this.showError("Error: " + error.message);
  } finally {
    this.hideLoading();
  }
}
