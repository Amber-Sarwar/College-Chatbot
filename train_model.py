
import pandas as pd
import joblib
from pathlib import Path

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

from predictor.text_normalizer import QuestionNormalizer



CSV_FILE_PATH = "dataset.csv"
MODEL_SAVE_PATH = Path("predictor") / "model_files" / "intent_classifier_pipeline.joblib"

data = pd.read_csv(CSV_FILE_PATH, encoding="utf-8")
data.columns = data.columns.str.strip()

X = data["Question"].astype(str)
y = data["Intent"].astype(str)

print("Loaded intents:", y.nunique())
print("Total samples:", len(X))


pipeline = Pipeline([
    ("normalize", QuestionNormalizer()),
    ("tfidf", TfidfVectorizer(
        ngram_range=(1, 3),
        sublinear_tf=True
    )),
    ("clf", LogisticRegression(
        max_iter=2000,
        C=5.0,
        solver="lbfgs"
    ))
])



print("Training intent classifier...")
pipeline.fit(X, y)
print("Training complete!")


MODEL_SAVE_PATH.parent.mkdir(parents=True, exist_ok=True)
joblib.dump(pipeline, MODEL_SAVE_PATH)

print("Model saved to:", MODEL_SAVE_PATH)