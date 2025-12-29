import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Creator Profile";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

interface CreatorProfile {
  _id: string;
  username: string;
  userdp: string;
  isVerified: boolean;
  followers: number;
  stats?: {
    totalPosts: number;
  };
}

async function getCreatorProfile(
  username: string
): Promise<CreatorProfile | null> {
  try {
    const baseURL =
      process.env.NEXT_PUBLIC_LIVE_URL ||
      process.env.NEXT_PUBLIC_LOCAL_URL ||
      "http://localhost:5000";
    const url = `${baseURL}/api/v1/inspire/creator/${encodeURIComponent(username)}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (!data || !data.success || !data.data) {
      return null;
    }

    return data.data as CreatorProfile;
  } catch (error) {
    console.error("Error fetching creator profile for OG image:", error);
    return null;
  }
}

export default async function Image({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await getCreatorProfile(username);

  if (!profile) {
    // Return a default image if profile not found
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 60,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 20 }}>Creator Not Found</div>
          <div style={{ fontSize: 24, opacity: 0.8 }}>Gennit AI</div>
        </div>
      ),
      {
        ...size,
      }
    );
  }

  // Try to fetch the profile picture
  let profileImageUrl = profile.userdp || "";
  
  // If userdp is a relative URL, make it absolute
  if (profileImageUrl && !profileImageUrl.startsWith("http")) {
    const baseURL =
      process.env.NEXT_PUBLIC_LIVE_URL ||
      process.env.NEXT_PUBLIC_LOCAL_URL ||
      "http://localhost:5000";
    profileImageUrl = `${baseURL}${profileImageUrl}`;
  }

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
          color: "white",
        }}
      >
        {/* Left side - Profile Picture */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginRight: "60px",
          }}
        >
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt={profile.username}
              width={200}
              height={200}
              style={{
                borderRadius: "50%",
                border: "6px solid white",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                width: 200,
                height: 200,
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.2)",
                border: "6px solid white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 80,
              }}
            >
              {profile.username[0]?.toUpperCase() || "?"}
            </div>
          )}
        </div>

        {/* Right side - Creator Info */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div style={{ fontSize: 64, fontWeight: "bold", marginRight: 16 }}>
              {profile.username}
            </div>
            {profile.isVerified && (
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "#3b82f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                }}
              >
                <svg
                  viewBox="0 0 22 22"
                  aria-label="Verified account"
                  role="img"
                  className="w-6 h-6 flex-shrink-0"
                  data-testid="icon-verified"
                  fill="#3b82f6"
                >
                  <g>
                    <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
                  </g>
                </svg>
              </div>
            )}
          </div>

          <div style={{ fontSize: 28, opacity: 0.9, marginBottom: "10px" }}>
            Gennit Creator
          </div>

          <div
            style={{
              display: "flex",
              gap: "30px",
              fontSize: 24,
              opacity: 0.8,
              marginTop: "20px",
            }}
          >
            <div>
              <span style={{ fontWeight: "bold" }}>
                {profile.stats?.totalPosts || 0}
              </span>{" "}
              Posts
            </div>
            <div>
              <span style={{ fontWeight: "bold" }}>{profile.followers}</span>{" "}
              Followers
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

