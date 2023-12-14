
export default function handler(req, res) {
  res.status(200).json({ socketUrl: `http://${ req.headers.host.split(':')[0]}` });
}